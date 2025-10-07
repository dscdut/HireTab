/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('suggestion_skills').del()

    // Get some candidate IDs to use for seeding
    const candidates = await knex('candidates').select('id').limit(3);

    if (candidates.length > 0) {
        // Inserts seed entries
        await knex('suggestion_skills').insert([
            {
                candidate_id: candidates[0].id,
                categories: 'Programming Languages',
                level: 'Advanced',
                keywords: ['JavaScript', 'TypeScript', 'Node.js', 'React'],
                created_at: new Date()
            },
            {
                candidate_id: candidates[0].id,
                categories: 'Databases',
                level: 'Intermediate',
                keywords: ['PostgreSQL', 'MongoDB', 'Redis'],
                created_at: new Date()
            },
            {
                candidate_id: candidates.length > 1 ? candidates[1].id : candidates[0].id,
                categories: 'Cloud Technologies',
                level: 'Beginner',
                keywords: ['AWS', 'Docker', 'Kubernetes'],
                created_at: new Date()
            }
        ]);
    }
};