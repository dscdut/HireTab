import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

// Swagger model for suggestion skills
ApiDocument.addModel('SuggestionSkillDto', {
    id: SwaggerDocument.ApiProperty({ type: 'int' }),
    candidateId: SwaggerDocument.ApiProperty({ type: 'int' }),
    categories: SwaggerDocument.ApiProperty({ type: 'string', example: 'Programming Languages' }),
    level: SwaggerDocument.ApiProperty({ type: 'string', example: 'Advanced' }),
    keywords: SwaggerDocument.ApiProperty({
        type: 'array',
        model: 'string',
        example: ['JavaScript', 'Node.js', 'React']
    }),
    createdAt: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
});

export const SuggestionSkillDto = body => {
    if (!body) return null;

    return {
        id: body.id ? parseInt(body.id) : null,
        candidateId: body.candidateId ? parseInt(body.candidateId) : (body.candidate_id ? parseInt(body.candidate_id) : null),
        categories: body.categories || '',
        level: body.level || '',
        keywords: Array.isArray(body.keywords)
            ? body.keywords
            : (body.keywords ? String(body.keywords).replace(/^\{|\}$/g, '').split(',').map(k => k.trim()).filter(Boolean) : []),
        createdAt: body.createdAt || body.created_at || null,
    };
};
