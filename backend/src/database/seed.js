import { query, getClient } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');

  const userId = uuidv4();
  const treeId = uuidv4();

  const client = await getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO users (id, firebase_uid, email, username, first_name, last_name, display_name, role, auth_method, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (email) DO NOTHING`,
      [userId, 'firebase-dev-uid', 'owner@cedig.mn', 'bat-erdene', 'Bat-Erdene', 'Admin', 'Bat-Erdene (Owner)', 'Owner', 'email', true]
    );

    await client.query(
      `INSERT INTO family_trees (id, name, code, owner_id, clan_name)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (code) DO NOTHING`,
      [treeId, 'Sartuul Ogiin Bichig', 'SARTUUL-2026', userId, 'Sartuul']
    );

    await client.query(
      `INSERT INTO tree_members (tree_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (tree_id, user_id) DO NOTHING`,
      [treeId, userId, 'Owner']
    );

    const peopleData = [
      { id: uuidv4(), firstName: 'Demberel', lastName: 'Bat-Erdene', surname: 'Bat-Erdene', clanName: 'Sartuul', birthPlace: 'Ulaanbaatar', biography: 'Sartuul clan header born in Ulaanbaatar. Resided and conducted scientific archives in Khentii province.', zodiacSign: 'Capricorn', birthYear: 1912, birthDate: '1912-01-12', deathDate: '1988', gender: 'male', occupation: 'Archivist & Scholar', education: 'Ulaanbaatar State Academy', awards: ['State Honorary Order of the Polar Star', 'Outstanding Academic Scroll'], notes: 'Primary scroll lines start here.', relationshipLabel: 'DIRECT LINE', verified: true },
      { id: uuidv4(), firstName: 'Ganbold', lastName: 'Demberel', surname: 'Demberel', clanName: 'Sartuul', birthPlace: 'Ulaanbaatar', biography: 'A prominent community elder and legal consultant.', zodiacSign: 'Taurus', birthYear: 1945, birthDate: '1945-05-18', deathDate: null, gender: 'male', occupation: 'Retired Jurist', education: 'National University of Mongolia', awards: ['Outstanding Citizen Award', 'Cultural Heritage Medal'], notes: 'Holds the primary hand-written book records.', relationshipLabel: 'HEAD OF CLAN', verified: true, fatherId: null, spouseId: null },
      { id: uuidv4(), firstName: 'Enkhjargal', lastName: 'D.', surname: 'Dorj', clanName: 'Borgijin', birthPlace: 'Arkhangai', biography: 'Matriarch of the family tree and leading voice in oral narratives.', zodiacSign: 'Virgo', birthYear: 1948, birthDate: '1948-09-02', deathDate: null, gender: 'female', occupation: 'Anatomist Professor', education: 'Mongolian Medical University', awards: ['Academic Excellence Trophy'], notes: 'Main source for early 20th-century oral records.', relationshipLabel: 'MATRIARCH', verified: true },
      { id: uuidv4(), firstName: 'Batmunkh', lastName: 'Ganbold', surname: 'Ganbold', clanName: 'Sartuul', birthPlace: 'Ulaanbaatar', biography: 'Tech pioneer and systems architect.', zodiacSign: 'Scorpio', birthYear: 1975, birthDate: '1975-11-04', deathDate: null, gender: 'male', occupation: 'Lead Systems Developer', education: 'Science and Technology University of Mongolia', awards: ['National Innovation Award (2024)', 'CEDIG Digital Design Medal'], notes: 'Active workspace maintainer.', relationshipLabel: 'DESCENDANT', verified: true },
      { id: uuidv4(), firstName: 'Narantuya', lastName: 'Ganbold', surname: 'Ganbold', clanName: 'Sartuul', birthPlace: 'Ulaanbaatar', biography: 'Independent researcher of linguistics and historic folklore.', zodiacSign: 'Cancer', birthYear: 1978, birthDate: '1978-07-20', deathDate: null, gender: 'female', occupation: 'Linguist & Philologist', education: 'State Pedagogical University', notes: 'Documented early-mid 20th century poetry.', relationshipLabel: 'DESCENDANT', verified: false, pendingOralHistory: true },
      { id: uuidv4(), firstName: 'Bolormaa', lastName: 'Batmunkh', surname: 'Batmunkh', clanName: 'Sartuul', birthPlace: 'Darkhan', biography: 'Young descendant expressing active interest in conserving heritage.', zodiacSign: 'Pisces', birthYear: 2005, birthDate: '2005-03-12', deathDate: null, gender: 'female', occupation: 'Undergrad Student', notes: 'Supplements digital interface uploads.', relationshipLabel: 'DESCENDANT', verified: true },
    ];

    for (const p of peopleData) {
      await client.query(
        `INSERT INTO people (id, tree_id, first_name, last_name, surname, clan_name, birth_place, biography, zodiac_sign, birth_year, birth_date, death_date, gender, occupation, education, awards, notes, relationship_label, verified, pending_oral_history)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [p.id, treeId, p.firstName, p.lastName, p.surname || null, p.clanName, p.birthPlace, p.biography || null, p.zodiacSign || null, p.birthYear, p.birthDate || null, p.deathDate || null, p.gender, p.occupation || null, p.education || null, p.awards || [], p.notes || null, p.relationshipLabel, p.verified, p.pendingOralHistory || false]
      );
    }

    if (peopleData.length >= 2) {
      await client.query('UPDATE people SET father_id = $1 WHERE id = $2', [peopleData[0].id, peopleData[1].id]);
    }
    if (peopleData.length >= 4) {
      await client.query('UPDATE people SET father_id = $1, mother_id = $2 WHERE id = $3', [peopleData[1].id, peopleData[2].id, peopleData[3].id]);
      await client.query('UPDATE people SET father_id = $1, mother_id = $2 WHERE id = $3', [peopleData[1].id, peopleData[2].id, peopleData[4].id]);
    }
    if (peopleData.length >= 6) {
      await client.query('UPDATE people SET father_id = $1 WHERE id = $2', [peopleData[3].id, peopleData[5].id]);
    }

    const notificationIds = [
      uuidv4(),
      uuidv4(),
    ];

    await client.query(
      `INSERT INTO notifications (id, user_id, type, title, message) VALUES
       ($1, $2, 'success', 'Tree Setup Completed', 'CEDIG has successfully initialized the Sartuul Family Tree.'),
       ($3, $4, 'info', 'Curation Tip', 'Add birth certificates for descendants to automatically earn the Verified badge.')`,
      [notificationIds[0], userId, notificationIds[1], userId]
    );

    await client.query(
      `INSERT INTO activity_logs (id, tree_id, type, description, user_name) VALUES
       ($1, $2, 'add', 'Database initialized with historical ancestral Sartuul clan lines.', 'CEDIG Archival Bot'),
       ($3, $4, 'media_add', 'Uploaded verified Historical Passport Scan for Demberel Bat-Erdene.', 'Admin User'),
       ($5, $6, 'edit', 'Updated Enkhjargal D. biography profiles to note anatomist contributions.', 'Admin User')`,
      [uuidv4(), treeId, uuidv4(), treeId, uuidv4(), treeId]
    );

    await client.query('COMMIT');
    console.log(`Seeded: 1 user, 1 tree, ${peopleData.length} people, 2 notifications, 3 activities`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
