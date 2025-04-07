import Joi from "joi";

const actionSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().pattern(/^\+998(88|90|93|91|96|94|44|71|77|98|99)\d{7}$/).message("Phone number xato to'g'irla").required(),
    email: Joi.string().email().pattern(/@(gmail\.com|mail\.com)$/).message("Email xatoku to'g'irla !").required(),
    password: Joi.string()
        .min(6)
        .max(30)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/)
        .message("Parol kamida 6 ta belgidan iborat bo‘lishi va harf hamda raqam bo‘lishi kerak")
        .required(),
    techId: Joi.number().required(),
    employeId: Joi.number().required(),
});

export { actionSchema };