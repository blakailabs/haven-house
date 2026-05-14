
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// We'll use the local environment variables for the project ID
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'haven-house-platform-5c9a2';

admin.initializeApp({
  projectId: projectId
});

const db = admin.firestore();

const seedData = async () => {
  console.log('🚀 Starting data seeding...');

  // 1. Seed BEDS
  const beds = [
    { id: '101-A', room: 'Room 101', status: 'occupied', residentName: 'John Doe', lockboxId: 'LB-001' },
    { id: '101-B', room: 'Room 101', status: 'available', lockboxId: 'LB-002' },
    { id: '102-A', room: 'Room 102', status: 'maintenance', lockboxId: 'LB-003', notes: 'Needs mattress replacement' },
    { id: '102-B', room: 'Room 102', status: 'available', lockboxId: 'LB-004' },
  ];

  for (const bed of beds) {
    const { id, ...data } = bed;
    await db.collection('beds').doc(id).set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Seeded bed: ${id}`);
  }

  // 2. Seed RESIDENTS
  const residents = [
    { id: 'RES-001', name: 'John Doe', bed: '101-A', entryDate: '2026-04-15', phone: '(555) 111-2222', status: 'active', compliance: 'good' },
    { id: 'RES-002', name: 'Michael Scott', bed: '102-A', entryDate: '2026-05-01', phone: '(555) 333-4444', status: 'active', compliance: 'warning' },
    { id: 'RES-003', name: 'Jim Halpert', bed: '101-B', entryDate: '2026-03-20', phone: '(555) 555-6666', status: 'active', compliance: 'good' },
  ];

  for (const res of residents) {
    const { id, ...data } = res;
    await db.collection('residents').doc(id).set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Seeded resident: ${data.name}`);
  }

  // 3. Seed REFERRALS
  const referrals = [
    { id: 'REF-001', name: 'Marcus Wright', source: 'Shelby County Jail', status: 'pending', date: '2026-05-06', phone: '(555) 123-4567', notes: 'Needs housing before parole date on 5/15.' },
    { id: 'REF-002', name: 'James Wilson', source: 'Regional Hospital', status: 'assessing', date: '2026-05-06', phone: '(555) 987-6543', notes: 'Currently in detox, ready for discharge Monday.' },
  ];

  for (const ref of referrals) {
    const { id, ...data } = ref;
    await db.collection('referrals').doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Seeded referral: ${data.name}`);
  }

  // 4. Seed CHECKLIST TASKS (Template)
  const tasks = [
    { text: 'Conduct initial intake interview', category: 'admission' },
    { text: 'Review house rules and policies', category: 'admission' },
    { text: 'Morning house check (beds made, common areas clean)', category: 'daily' },
    { text: 'Conduct weekly house meeting', category: 'weekly' },
  ];

  for (const task of tasks) {
    await db.collection('taskTemplates').add({
      ...task,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  console.log('✅ Seeded task templates');

  console.log('⭐ Seeding completed successfully!');
};

seedData().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
