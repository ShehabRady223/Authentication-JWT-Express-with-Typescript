import resend from "../config/resend.js"
import { NODE_ENV } from "../constants/env.js";
import { EMAIL_SENDER } from './../constants/env.js';

type Params = {
    to: string,
    subject: string,
    text: string,
    html: string
}

const getFromEmail = () =>
    NODE_ENV === "development" ? 'AIChestDiagnosis@resend.dev' : EMAIL_SENDER;

const getToEmail = (to: string) =>
    NODE_ENV === "development" ? 'radyshehab258@yahoo.com' : to;

export const sendEmail = async ({ to, subject, text, html }: Params) =>
    await resend.emails.send({
        from: getFromEmail(),
        to: getToEmail(to),
        subject,
        text,
        html
    });