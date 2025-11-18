# Mailer Service

This service (`mailer.service.ts`) provides functionality for sending emails using Nodemailer and email-templates. It allows you to send emails using pre-defined templates with dynamic content.

## Description

The `MailerService` simplifies the process of sending emails within your NestJS application. It uses Nodemailer to handle the email sending process and email-templates to manage email templates with EJS.  This approach allows you to separate email content from the code, making it easier to manage and update.

## Features

*   **Template-based Emails:** Sends emails using pre-defined templates located in the `views/email-templates` directory.
*   **Dynamic Content:** Supports dynamic content within email templates using EJS template engine.
*   **Gmail Integration:** Configured to use Gmail as the email provider by default.
*   **Environment Configuration:** Retrieves email credentials (username and password) from environment variables.

## Usage

1.  **Inject the Service:** Inject the `MailerService` into the service or controller where you need to send emails.

    ```typescript
    import { Injectable } from '@nestjs/common';
    import { MailerService } from './mailer.service';

    @Injectable()
    export class MyService {
      constructor(private readonly mailerService: MailerService) {}

      async sendWelcomeEmail(user: User) {
        await this.mailerService.sendMail(
          '[email address removed]',
          user.email,
          'Welcome to Our Platform',
          'welcome', // Template name
          { name: user.name }, // Template variables
        );
      }
    }
    ```

2.  **Create Email Templates:** Create email templates in the `views/email-templates` directory. Each template should have its own subdirectory with an `html` file containing the EJS template.

    Example: `views/email-templates/welcome/html/index.ejs`

    ```html
    <h1>Welcome, <%= name %>!</h1>
    <p>Thank you for joining our platform.</p>
    ```

3.  **Send Emails:** Use the `sendMail` method to send emails.

    ```typescript
    await this.mailerService.sendMail(
      '[email address removed]',
      user.email,
      'Welcome to Our Platform',
      'welcome',
      { name: user.name },
    );
    ```

## Configuration

1.  **Environment Variables:** Define the following environment variables in your `.env` file:

    *   `MAIL_USERNAME`: Your Gmail username.
    *   `MAIL_PASSWORD`: Your Gmail password or app password.

2.  **Template Directory:** The `templateDir` variable in the `sendMail` method defines the base directory for email templates. By default, it's set to `views/email-templates`.

## Dependencies

This service uses the following packages:

*   `nodemailer`: For sending emails.
*   `email-templates`: For managing email templates.

## Important Considerations

*   **Gmail App Passwords:** If you're using Gmail, you might need to generate an app password for security reasons.
*   **Email Testing:** Consider using a tool like Mailtrap or Ethereal to test emails during development without sending actual emails.
*   **Error Handling:** Implement proper error handling in your application to catch and handle potential email sending errors.
