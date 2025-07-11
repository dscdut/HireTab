import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('RegisterDto', {
    name: SwaggerDocument.ApiProperty({ type: 'string' }),
    email: SwaggerDocument.ApiProperty({ type: 'string' }),
    password: SwaggerDocument.ApiProperty({ type: 'string' }),
    confirm_password: SwaggerDocument.ApiProperty({ type: 'string' }),
    birthday: SwaggerDocument.ApiProperty({ type: 'string', format: 'date' }),
    phone_number: SwaggerDocument.ApiProperty({ type: 'string' }),
    address: SwaggerDocument.ApiProperty({ type: 'string', required: false, maxLength: 500 }), 
});


export const RegisterDto = body => ({
    name: body.name,
    email: body.email,
    password: body.password,
    confirm_password: body.confirm_password,
    birthday: body.birthday,
    phone_number: body.phone_number,
    address: body.address ?? null, 
});

