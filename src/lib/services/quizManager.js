// src/lib/quizManager.js
import { supabase } from './supabaseClient.js';

/**
 * Create a new quiz with questions and options
 * @param {string} userId - Current user's ID
 * @param {object} quizData - { name, description, image_url, questions: [...] }
 */
export async function createQuiz(userId, quizData) {
  try {
    // 1. Insert quiz
    const { data: quizResult, error: quizError } = await supabase
      .from('quizzes')
      .insert([
        {
          user_id: userId,
          name: quizData.name,
          description: quizData.description,
          image_url: quizData.image_url,
        },
      ])
      .select();

    if (quizError) throw quizError;

    const quizId = quizResult[0].id;

    // 2. Insert questions
    const questionsToInsert = quizData.questions.map((q, idx) => ({
      quiz_id: quizId,
      title: q.title,
      order_index: idx,
    }));

    const { data: questionsResult, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (questionsError) throw questionsError;

    // 3. Insert options
    const optionsToInsert = [];
    quizData.questions.forEach((q, qIdx) => {
      q.options.forEach((opt, oIdx) => {
        optionsToInsert.push({
          question_id: questionsResult[qIdx].id,
          text: opt.text,
          value: opt.value,
          order_index: oIdx,
          is_correct: opt.is_correct || false,
        });
      });
    });

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optionsError) throw optionsError;

    return { success: true, quizId };
  } catch (error) {
    console.error('Create quiz failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all quizzes for the current user
 */
export async function getMyQuizzes(userId) {
  try {
    const { data: quizzes, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (quizError) throw quizError;

    if (quizzes.length === 0) return { quizzes: [] };

    // Fetch questions for all quizzes
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .in('quiz_id', quizzes.map(q => q.id))
      .order('order_index');

    if (questionsError) throw questionsError;

    // Fetch options for all questions
    const { data: options, error: optionsError } = await supabase
      .from('options')
      .select('*')
      .in('question_id', questions.map(q => q.id))
      .order('order_index');

    if (optionsError) throw optionsError;

    // Reconstruct nested structure
    const result = quizzes.map(quiz => {
      const quizQuestions = questions.filter(q => q.quiz_id === quiz.id);
      return {
        id: quiz.id,
        name: quiz.name,
        description: quiz.description,
        image_url: quiz.image_url,
        questions: quizQuestions.map(question => {
          const questionOptions = options.filter(o => o.question_id === question.id);
          return {
            id: question.id,
            title: question.title,
            options: questionOptions.map(opt => ({
              id: opt.id,
              text: opt.text,
              value: opt.value,
              is_correct: opt.is_correct,
            })),
          };
        }),
        created_at: quiz.created_at,
        updated_at: quiz.updated_at,
      };
    });

    return { quizzes: result };
  } catch (error) {
    console.error('Fetch quizzes failed:', error);
    return { quizzes: [], error: error.message };
  }
}

/**
 * Delete a quiz and all its questions/options
 */
export async function deleteQuiz(quizId) {
  try {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Delete quiz failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single quiz (for editing/playing)
 */
export async function getQuizById(quizId) {
  try {
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError) throw quizError;

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index');

    if (questionsError) throw questionsError;

    const { data: options, error: optionsError } = await supabase
      .from('options')
      .select('*')
      .in('question_id', questions.map(q => q.id))
      .order('order_index');

    if (optionsError) throw optionsError;

    return {
      id: quiz.id,
      name: quiz.name,
      description: quiz.description,
      image_url: quiz.image_url,
      questions: questions.map(q => ({
        id: q.id,
        title: q.title,
        options: options
          .filter(o => o.question_id === q.id)
          .map(o => ({
            id: o.id,
            text: o.text,
            value: o.value,
            is_correct: o.is_correct,
          })),
      })),
    };
  } catch (error) {
    console.error('Get quiz failed:', error);
    return null;
  }
}
/**
 * Update a quiz and its questions/options
 * Replaces all questions and options (deletes old ones, inserts new)
 * @param {string} quizId - Quiz ID to update
 * @param {object} quizData - { name, description, image_url, questions: [...] }
 */
export async function updateQuiz(quizId, quizData) {
  try {
    // 1. Update quiz metadata
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({
        name: quizData.name,
        description: quizData.description,
        image_url: quizData.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quizId);
 
    if (updateError) throw updateError;
 
    // 2. Delete all existing questions (options will cascade delete)
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('quiz_id', quizId);
 
    if (deleteError) throw deleteError;
 
    // 3. Insert new questions
    const questionsToInsert = quizData.questions.map((q, idx) => ({
      quiz_id: quizId,
      title: q.title,
      order_index: idx,
    }));
 
    const { data: questionsResult, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();
 
    if (questionsError) throw questionsError;
 
    // 4. Insert new options
    const optionsToInsert = [];
    quizData.questions.forEach((q, qIdx) => {
      q.options.forEach((opt, oIdx) => {
        optionsToInsert.push({
          question_id: questionsResult[qIdx].id,
          text: opt.text,
          value: opt.value,
          order_index: oIdx,
          is_correct: opt.is_correct || false,
        });
      });
    });
 
    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);
 
    if (optionsError) throw optionsError;
 
    return { success: true, quizId };
  } catch (error) {
    console.error('Update quiz failed:', error);
    return { success: false, error: error.message };
  }
}