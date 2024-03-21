import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

def send_email(email,recovery_url):
    try:
        sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
        from_email = Email("giftbuddy.app@gmail.com")
        to_email = To(email) 
        subject = "Password recovery request - GiftBuddy App"
        content = Content("text/plain", f"Hello, You are receiving this email because you have requested to reset your password on our platform. Please click the link below to reset your password: {recovery_url} If you did not request to reset your password, you can safely ignore this email or contact us if you believe this is a mistake. Thank you")
        mail = Mail(from_email, to_email, subject, content)

        mail_json = mail.get()

        response = sg.client.mail.send.post(request_body=mail_json)
        print(response.status_code)
        print(response.headers)

    except Exception as e:
        print("Error sending password reset email:", e)

