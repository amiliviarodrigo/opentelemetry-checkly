# Astronomy Shop — Checkly Monitoring

This repository is the OpenTelemetry Demo ("Astronomy Shop"), a telescope
e-commerce storefront, used as the target application for a Checkly
Solutions Architect take-home exercise. The `checkly/` directory contains
the actual deliverable: a Checkly monitoring-as-code project built against
this app.

## Introduction

The scenario: a prospect runs this e-commerce platform. They already have a
traditional observability stack (metrics, logs, traces) but no synthetic
monitoring, and they've had incidents where customers noticed problems
before their own internal alerting did.

Rather than trying to monitor the entire application, this project focuses
on the **critical path** — the sequence of actions a customer takes that
directly generates revenue: browsing products, viewing a product, adding it
to a cart, and checking out. That's the flow most worth protecting, and the
one most representative of "is the business actually working right now."

The approach mixes two check types:

- **REST API checks** against the app's own frontend routes, for fast,
  frequent, granular triage — when something breaks, these narrow down
  which part of the system is responsible.
- **User journey checks**, driving a real browser through the app the way
  an actual customer would, to catch anything an API-level check can't
  (broken pages, JS errors, a flow that technically returns 200s at every
  step but doesn't actually work end to end).

The underlying codebase is intentionally large and polyglot — over a dozen
microservices in different languages (Go, C#, C++, Rust, Node.js,
Java/Kotlin, PHP, Ruby), communicating over gRPC, HTTP, and Kafka. Covering
all of it isn't the goal here; the checks below cover the checkout critical
path deliberately and thoroughly, which is sufficient to demonstrate the
approach for this exercise.

## Testing Coverage

The critical path, as an actual customer walks it:

**Browse (PLP) → View product (PDP) → Add to cart → View cart → Checkout → Order confirmation**

Checkout itself is the most consequential single step — placing an order
fans out into a specific sequence of calls across five different services
before the customer sees a confirmation:

1. **Cart** — get the cart's contents
2. **Product Catalog** — price each item
3. **Currency** — convert each item's price to the customer's currency
4. **Shipping** — get a shipping cost quote
5. **Currency** — convert the shipping cost
6. **Payment** — charge the card
7. **Shipping** — ship the order, get a tracking ID
8. **Cart** — empty the cart

For the full system architecture (all services, not just the ones on this
critical path), see the [official diagram](https://opentelemetry.io/docs/demo/architecture/).

### Steps → services → routes

| Step | Microservice(s) involved | Route |
|---|---|---|
| Browse products (PLP) | Product Catalog | `GET /api/products` |
| View product (PDP) | Product Catalog | `GET /api/products/{id}` |
| Add item to cart | Cart | `POST /api/cart` |
| View cart | Cart, Product Catalog | `GET /api/cart` |
| Live shipping estimate | Shipping, Currency | `GET /api/shipping` |
| Place order | Cart, Product Catalog, Currency, Shipping, Payment | `POST /api/checkout` |

### Checks implemented

| Check | Type | Verifies |
|---|---|---|
| Products API | API | Product Catalog is reachable and returns products |
| Cart API | API | Cart is reachable, returns a well-formed response |
| Cart API - Add Item | API | Cart's write path actually adds an item |
| Currency API | API | Currency service is reachable |
| Shipping API | API | Shipping quote calculation works |
| Checkout API | API | The full critical path succeeds end to end — places a real order |
| Homepage | Browser | The product listing page loads |
| Product Detail Page | Browser | A product page loads with all its content |
| Cart Page | Browser | The cart page loads |
| Checkout Journey | Browser | The full 8-step customer journey, including a real checkout |

## Scaffolding

```
checkly/
├── __checks__/
│   ├── cart/
│   ├── checkout/
│   ├── currency/
│   ├── product-catalog/
│   ├── shipping/
│   ├── frontend/
│   └── env.ts
├── checkly.config.ts
├── package.json
└── README.md
```

Each folder under `__checks__/` is named after what it tests — API checks
live in their corresponding microservice's folder, browser checks live in
`frontend/`.

## Execution Environment

This app only runs locally via Docker Compose — it isn't deployed anywhere
public. Checkly's own cloud runners can't reach `localhost`, so checks run
from a **Private Location**: a small agent that runs alongside the app, on
the same Docker network, and executes checks on Checkly's behalf.

### Running the app

From the repo root:

```bash
docker compose up
```

The storefront is then available at `http://localhost:8080`.

### Running the Private Location agent

Requires a Private Location created in the Checkly dashboard first, with
its API key placed in `checkly/.env.checkly.local` (gitignored, copy
`checkly/.env.checkly.local.example` as a starting point):

```bash
docker compose -f compose.yaml -f compose.checkly-agent.yaml up -d checkly-agent
```

### Running checks against it

From `checkly/`, point checks at the app's internal Docker DNS name
(`frontend-proxy`, not `localhost` — from inside the agent's own container,
`localhost` means the agent itself):

```bash
ENVIRONMENT_URL=http://frontend-proxy:8080 \
  npx checkly test --private-location=<your-private-location-name>
```

See `checkly/README.md` for the full CLI reference and deploy instructions.
