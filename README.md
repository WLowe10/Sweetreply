# Sweetreply

[Sweetreply](https://www.sweetreply.io/) is an AI marketing tool that engages with Reddit users on behalf of your product.

## Features

-   Low latency Reddit post filtering that detects relevant reddit posts within 1 minute of them being published.
-   Automated reply generation using LLMs
-   Automated reply sending via headless browser automation.
-   Subscription billing plans with Stripe
-   Notification webhooks

## Technical qualities

-   Utilizes a monorepo for code sharing and typesafety
-   Utilizes tRPC for typesafe RPC layer.
-   Prisma as an ORM for PostgreSQL
-   Redis and bull queue for handling jobs

## Get started

This monorepo contains several _packages_ and _applications_.

### Web

The web app for Sweetreply, located [here](./apps/web), is built with Remix, React, and Mantine UI. It serves as the primary landing page and dashboard for Sweetreply users.

### Server

The server app for Sweetreply, located [here](./apps/server), is built with Express and tRPC. It is the main backend service for Sweetreply.
