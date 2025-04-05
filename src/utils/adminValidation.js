import Joi from "joi";

const amdinSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/@(gmail\.com|mail\.com)$/)
    .message("Email faqat @gmail.com yoki @mail.com bo‘lishi kerak")
    .required(),

  password: Joi.string()
    .min(6)
    .max(15)
    .message("Parol uzunligi 6 dan kam yoki 15 dan ko‘p bo‘lmasligi kerak")
    .required(),
});

export default amdinSchema;