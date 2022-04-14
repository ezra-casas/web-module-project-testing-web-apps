import React from 'react';
import { findByText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);

    const headerElement = screen.queryByText(/Contact Form/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const getFirstName = screen.getByLabelText(/first name*/i);
    userEvent.type(getFirstName, "123");

    const errMsg = await screen.findAllByTestId('error')
    expect(errMsg).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    await waitFor(() => {
        const errMsg = screen.queryAllByTestId("error");
        expect(errMsg).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);

    userEvent.type(firstNameInput, "warren");
    userEvent.type(lastNameInput, "longname");
    
    const button = screen.getByRole("button");
    userEvent.click(button);

    const errMsg = await screen.findAllByTestId("error");
    expect(errMsg).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)

    const emailField = screen.getByLabelText(/email*/i);

    userEvent.type(emailField, "ezra@mozmail")

    const errMsg = await screen.findByText(/email must be a valid email address/i);

    expect(errMsg).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    const errMsg = await screen.findByText(/lastName is a required field/i);
    expect(errMsg).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailField  = screen.getByLabelText(/email*/i);

    userEvent.type(firstNameInput, "daniel");
    userEvent.type(lastNameInput, "casas");
    userEvent.type(emailField, "ezra@email.com");
    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);
    
    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("daniel");
        const lastNameDisplay = screen.queryByText("casas");
        const emailDisplay = screen.queryByText("ezra@email.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailField  = screen.getByLabelText(/email*/i);
    const messageField = screen.getByLabelText(/message/i);

    userEvent.type(firstNameInput, "daniel");
    userEvent.type(lastNameInput, "casas");
    userEvent.type(emailField, "ezra@email.com");
    userEvent.type(messageField, "message text");

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);
    
    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("daniel");
        const lastNameDisplay = screen.queryByText("casas");
        const emailDisplay = screen.queryByText("ezra@email.com");
        const messageDisplay = screen.queryByText("message text");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })

});
