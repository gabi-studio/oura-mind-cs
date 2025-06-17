// Get affirmation from EmotiQuote API based on detected emotions
async function getAffirmation(emotions) {
  try {
    // Map your emotion names to EmotiQuote's supported emotions
    const emotionMapping = {
      'joy': 'joy',
      'happiness': 'joy',
      'excitement': 'joy',
      'sadness': 'sadness',
      'sad': 'sadness',
      'grief': 'sadness',
      'fear': 'fear',
      'anxiety': 'fear',
      'worry': 'fear',
      'anger': 'anger',
      'frustration': 'anger',
      'rage': 'anger',
      'disgust': 'disgust',
      'contempt': 'disgust',
      'revulsion': 'disgust'
    };
    
    // Get the primary emotion and map it to EmotiQuote format
    let targetEmotion = 'joy'; // default fallback
    if (emotions && emotions.length > 0) {
      const primaryEmotion = emotions[0].name.toLowerCase();
      targetEmotion = emotionMapping[primaryEmotion] || 'joy';
    }
    
    console.log('🌟 Fetching affirmation for emotion:', targetEmotion);
    
    // Call EmotiQuote API
    const response = await fetch(`https://emotiquote-api.onrender.com/api/quotes/${targetEmotion}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`EmotiQuote API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Affirmation received:', data);
    
    // Return the affirmation text (adjust based on EmotiQuote's response format)
    return {
      affirmation: data.quote || data.text || data.message || data.affirmation
    };
    
  } catch (error) {
    console.error('EmotiQuote API error:', error);
    
    // Emotion-specific fallback affirmations
    const fallbackAffirmations = {
      joy: "Your joy is contagious and brings light to the world around you.",
      sadness: "It's okay to feel sad. You are strong enough to get through this difficult time.",
      anger: "Your feelings are valid. Take a deep breath and trust in your ability to find peace.",
      fear: "You are braver than you believe and stronger than you feel. You can overcome this.",
      disgust: "Trust your instincts. You have the wisdom to navigate through challenging situations.",
      default: "You are doing great by taking time to reflect on your thoughts and feelings."
    };
    
    // Try to match emotion and return appropriate fallback
    let fallbackEmotion = 'default';
    if (emotions && emotions.length > 0) {
      const primaryEmotion = emotions[0].name.toLowerCase();
      const supportedEmotions = ['joy', 'sadness', 'anger', 'fear', 'disgust'];
      
      // Check if it's directly supported
      if (supportedEmotions.includes(primaryEmotion)) {
        fallbackEmotion = primaryEmotion;
      } else {
        // Map to closest emotion
        const emotionMap = {
          'happiness': 'joy',
          'excitement': 'joy',
          'sad': 'sadness',
          'grief': 'sadness',
          'anxiety': 'fear',
          'worry': 'fear',
          'frustration': 'anger',
          'rage': 'anger',
          'contempt': 'disgust',
          'revulsion': 'disgust'
        };
        fallbackEmotion = emotionMap[primaryEmotion] || 'default';
      }
    }
    
    const fallback = fallbackAffirmations[fallbackEmotion];
    console.log('Using fallback affirmation for:', fallbackEmotion);
    
    return { affirmation: fallback };
  }
}

export { getAffirmation };