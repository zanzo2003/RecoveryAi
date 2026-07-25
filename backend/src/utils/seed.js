require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { openai } = require('../services/openai.service');

const educationalContent = [
  {
    title: 'Understanding Substance Use Disorder',
    source: 'NIDA',
    content: 'Substance use disorder (SUD) is a complex condition in which there is uncontrolled use of a substance despite harmful consequences. People with SUD have an intense focus on using a certain substance such as alcohol, tobacco, or illicit drugs, to the point where the person\'s ability to function in day-to-day life becomes impaired.',
  },
  {
    title: 'Stages of Recovery',
    source: 'SAMHSA',
    content: 'Recovery is a process of change through which people improve their health and wellness, live self-directed lives, and strive to reach their full potential. The four major dimensions of recovery are: Health, Home, Purpose, and Community.',
  },
  {
    title: 'Managing Cravings',
    source: 'NIDA',
    content: 'Cravings are intense urges to use a substance. Effective strategies include: urge surfing (observing the craving without acting on it), distraction techniques, calling a support person, engaging in physical activity, and practicing mindfulness or deep breathing exercises.',
  },
  {
    title: 'Withdrawal Symptoms Overview',
    source: 'WHO',
    content: 'Withdrawal symptoms occur when a person who is physically dependent on a substance suddenly stops or reduces their use. Symptoms vary by substance but may include anxiety, sweating, nausea, insomnia, and in severe cases, seizures. Medical supervision is recommended for alcohol and opioid withdrawal.',
  },
  {
    title: 'Relapse Prevention Strategies',
    source: 'SAMHSA',
    content: 'Relapse prevention involves identifying personal triggers, developing coping skills, building a support network, and creating an action plan. HALT (Hungry, Angry, Lonely, Tired) is a useful self-check tool. Having a sponsor or support person to call in moments of craving is highly effective.',
  },
  {
    title: 'The Role of Support Networks',
    source: 'SAMHSA',
    content: 'Social support is one of the strongest protective factors in recovery. Peer support groups like AA, NA, and SMART Recovery provide community, accountability, and shared experience. Research shows people with strong support networks are significantly more likely to sustain long-term recovery.',
  },
  {
    title: 'Medication-Assisted Treatment (MAT)',
    source: 'SAMHSA',
    content: 'MAT combines FDA-approved medications with counseling and behavioral therapies for opioid and alcohol use disorders. Medications include buprenorphine, methadone, and naltrexone for opioids; and naltrexone, acamprosate, and disulfiram for alcohol. MAT has been shown to reduce opioid use, overdose deaths, and criminal activity.',
  },
  {
    title: 'Mindfulness in Recovery',
    source: 'NIDA',
    content: 'Mindfulness-based relapse prevention (MBRP) teaches individuals to observe cravings and negative emotions without automatically reacting to them. Regular mindfulness practice reduces stress, improves emotional regulation, and decreases relapse rates in people recovering from substance use disorders.',
  },
  {
    title: 'Grounding Techniques for Craving Management',
    source: 'SAMHSA',
    content: 'Grounding techniques help redirect attention from cravings to the present moment. The 5-4-3-2-1 technique: identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Box breathing: inhale 4 seconds, hold 4, exhale 4, hold 4. Repeat 4 times.',
  },
  {
    title: 'Alcohol Use Disorder: Signs and Help',
    source: 'NIDA',
    content: 'Signs of alcohol use disorder include drinking more than intended, failed attempts to cut down, continued drinking despite negative consequences, and withdrawal symptoms. Treatment options include behavioral therapy, support groups, and medications like naltrexone. Help is available 24/7 at SAMHSA\'s National Helpline: 1-800-662-4357.',
  },
  {
    title: 'Opioid Crisis and Treatment',
    source: 'WHO',
    content: 'Opioid use disorder affects millions globally. Opioid overdose can be reversed with naloxone (Narcan), which should be kept on hand by anyone at risk or who knows someone at risk. Treatment includes MAT, behavioral counseling, and peer support. Fentanyl-laced drugs increase overdose risk significantly.',
  },
  {
    title: 'Cognitive Behavioral Therapy (CBT) for SUD',
    source: 'NIDA',
    content: 'CBT helps people in recovery identify and change negative thought patterns and behaviors that contribute to substance use. It teaches coping skills to manage cravings, stress, and situations that trigger drug or alcohol use. CBT has strong evidence supporting its effectiveness for multiple substance use disorders.',
  },
  {
    title: 'Co-occurring Mental Health Disorders',
    source: 'SAMHSA',
    content: 'Many people with SUD also have co-occurring mental health conditions like depression, anxiety, PTSD, or bipolar disorder. Treating both conditions simultaneously (integrated dual diagnosis treatment) leads to better outcomes than treating them separately. Mental health treatment is a critical part of comprehensive SUD care.',
  },
  {
    title: 'Building a Recovery Plan',
    source: 'SAMHSA',
    content: 'A personal recovery plan outlines your goals, support network, coping strategies, triggers, and emergency contacts. Key elements: identify your "why" (motivation to stay sober), list people you can call in a crisis, plan healthy replacement activities, and schedule regular check-ins with a counselor or support group.',
  },
  {
    title: 'Physical Health in Recovery',
    source: 'WHO',
    content: 'Substance use affects physical health including nutrition, sleep, and immune function. Recovery involves rebuilding physical health through balanced nutrition, regular exercise, adequate sleep (7-9 hours), and avoiding other addictive substances including nicotine. Physical activity is a powerful natural mood booster and craving reducer.',
  },
  {
    title: 'Family and Recovery',
    source: 'SAMHSA',
    content: 'Substance use disorders affect entire families. Family therapy can help repair relationships, improve communication, and create a supportive home environment. Al-Anon and Nar-Anon are free support groups for family members and friends of people with alcohol and drug use disorders.',
  },
  {
    title: 'Crisis Resources',
    source: 'SAMHSA',
    content: 'If you or someone you know is in crisis: Call or text 988 (Suicide & Crisis Lifeline, available 24/7). SAMHSA National Helpline: 1-800-662-HELP (4357), free, confidential, 24/7. Crisis Text Line: Text HOME to 741741. For medical emergencies or overdose, call 911 immediately.',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const db = mongoose.connection.db;
  const collection = db.collection('education_resources');

  // Clear existing
  await collection.deleteMany({});
  console.log('Cleared existing education_resources');

  for (const doc of educationalContent) {
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: doc.content,
    });
    const embedding = embeddingRes.data[0].embedding;
    await collection.insertOne({ ...doc, embedding });
    console.log(`Seeded: ${doc.title}`);
  }

  console.log(`\nSeeded ${educationalContent.length} educational documents.`);
  console.log('\nIMPORTANT: Create a Vector Search index named "education_vector_index"');
  console.log('on the "education_resources" collection, field "embedding", 1536 dims, cosine similarity.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
