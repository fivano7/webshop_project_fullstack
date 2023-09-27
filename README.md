# Webshop Fullstack Project

This repository contains two projects: webshop_api and webshop_frontend. The webshop_api is a backend application developed using Express.js, while webshop_frontend is a frontend application built with Next.js.

## Features & Technologies

Webshop API acts as the backend application for communication between the frontend and the database. It is built using Express.js and uses the Mongoose package to interact with the MongoDB database.

Webshop Frontend serves as the user interface for the webshop application. It is developed using Next.js, which is framework for React. The frontend utilizes pure CSS for styling elements, without the need for additional libraries.

#### Key Features

You can watch a preview video of the webshop [here](https://www.youtube.com/watch?v=k2Ni4-Trvh4&ab_channel=FilipIvanovic).

- **User Authentication and Authorization**: This includes secure user registration, login, and robust authorization mechanisms using Json Web Token (JWT). Additionally, it implements mechanisms for email address confirmation using tokens sent to the user's email and password reset functionality, which also uses tokens sent to the user's email.

- **Entity Management**: The application uses 15 main entities: User, Category, Product, Cart, CartItem, Favorite, FavoriteItem, Order, OrderItem, OrderStatus, Review, FAQ, DeliveryDetail, NewsletterSubscriber, and FeaturedItem. It supports CRUD (Create, Read, Update, Delete) operations for all of these entities.

- **Middlewares**: The application incorporates various middlewares, including an advanced result middleware that adds pagination, sorting, and select functionality to JSON responses. It also features an error handler middleware and an authentication middleware that handles all authentication-related processes before the request reaches the controller.

- **Email Sending Capability**: The application utilizes the nodemailer package with the mailtrap service to send emails to users. This functionality serves numerous purposes, including email and newsletter sign-up confirmations, as well as sending emails to all newsletter subscribers.

- **Data Seeder**: The application uses a data seeder to quickly populate the webshop with data, including categories, products, reviews, FAQs, user profiles with their delivery details, newsletter subscribers, and even items within shopping carts and favorite items.

- **Minimalistic Design**: Through CSS, I've developed a simplified black-and-white design that tries to align with the pottery-themed ambiance of the webshop.

- **Card Payments With Stripe (Webhooks)**: Customers can securely make payments for their orders using Stripe, which also offers Apple Pay and Google Pay payments. The application utilizes Stripe Webhooks to ensure seamless payment processing. Additionally, users have the alternative choice to pay with cash on delivery for added convenience.

- **Shopping Cart and Favorites**: The application offers a shopping cart feature available to both guests and registered users. For guests, the cartId is stored in a cookie, while for registered users, it is securely stored in the database. This ensures that registered users can conveniently access their shopping carts from multiple devices. The same approach is applied to favorite items. If a guest decides to register, their guest cart seamlessly integrates with their newly created account. Likewise, if a user logs in, any items in their guest cart, along with the items in their account's cart, are merged. This ensures that no data is lost during the transition.

- **Product Reviews**: Registered users have the ability to write one review per product. The ratings they provide for the product are then averaged to provide a better understanding of the product's quality for other users.

- **Featured Products**: On the homepage, users can view products selected by the admin as featured. Additionally, the admin has the capability to include promotional messages that are displayed above the featured products.

- **Newsletter Subscription**: Users have the option to subscribe to the newsletter. Once they confirm their email address, they will be able to receive newsletters sent by the admin directly to their email.

- **Admin Panel**: When logged in as an admin, you have the ability to manage categories, products, featured products, FAQs, orders, user data, and send newsletters to subscribers from the admin panel.

Here are screenshots of a few pages:

![Home Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/d14902f1-bcb6-4a76-87d8-74735ef32289)
![Category Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/237522c8-8fe2-4e99-a5f8-018828b0f762)
![Product Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/32c567e9-7630-4113-96c2-ae07a08e7dd4)
![Login Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/20992c31-db8f-4da7-a2c9-ade7c57b31ff)
![Favourites Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/b51bce6a-592e-4720-92b3-cd45151143aa)
![Cart Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/bc1eedd5-73c6-4b26-af4f-7bda7f7768c5)
![Stripe Payment](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/8a1e7858-6dd7-4654-9d55-b146387b967a)
![Order Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/70e32166-993c-42cc-b0bc-4dd056bc9161)
![Admin Page](https://github.com/fivano7/webshop_project_fullstack/assets/47385995/b8147b66-caa2-4769-838b-9696b4d09d39)

## Project In Action
### Explore API Documentation

To understand how the webshop_api (backend) works and explore its capabilities, you can visit [API documentation](https://documenter.getpostman.com/view/16148599/2s9YCBupYp). This documentation provides detailed information about the available endpoints, request examples, and responses.

You can even send example requests directly to the API, like this [example API request](https://webshop-api-rust.vercel.app/api/v1/products). This will allow you to interact with the API and see its responses in action.

### Explore the Webshop Frontend

To experience the functional version of this webshop, visit [webshop frontend](https://webshop-frontend-five.vercel.app). Here, you can browse through the webshop, view products, and even make test orders.

## Run Project Locally
### Installation

1. Clone this repository: `git clone https://github.com/fivano7/webshop_project_fullstack.git`
2. Navigate to the webshop_project_fullstack directory `cd webshop_project_fullstack` and install dependencies with `npm install`
3. Navigate to the webshop_api directory `cd webshop_api` and install dependencies: `npm install`
4. Navigate to the webshop_frontend directory `cd ..` and then `cd webshop_frontend` and install dependencies: `npm install`

### Configuring Environment Variables for webshop_api

1. Navigate to the webshop_api/src/config folder with your file explorer.
2. Rename the config.copy.env file to config.env.
3. Inside the config.env file, replace variable values in the format <variable_value> with your desired values.

### Configuring Environment Variables for webshop_frontend

1. Navigate to the webshop_frontend folder with your file explorer.
2. Rename the .env.env.local file to .env.local
3. Inside the .env.local file, replace variable values in the format <variable_value> with your desired values.

### (Optional) Fill The Database With Dummy Data
1. Navigate to the webshop_api directory `cd ..` and then `cd webshop_api`
2. Seed the database with `npm run import_data`

### Running
1. Go back to the root directory with `cd ..`
2. Start the webshop_project_fullstack: `npm start`
3. The API will be available at `http://localhost:5000`
4. The Frontend application will be available at `http://localhost:3000`

## Planned Upgrades

I have several upgrades planned to enhance this project:

1. **Email Sending Enhancement**: I will replace the "mailtrap" service with actual email delivery to improve communication.

2. **Responsive Design Implementation**: I want all pages to be responsive, so whether you're on a desktop, tablet, or phone, you'll have good user experience.

3. **Transition to TypeScript**: I want to switch from JavaScript to TypeScript because of all the benefits it brings.

4. **Code Testing**: I want to implement unit tests for both the backend and frontend.
