# 1Fi Marketplace

A responsive React implementation of the 1Fi Marketplace experience, built as part of the SDE Intern assignment.

## Features

- 1Fi Marketplace product listing
- Product images, names and pricing
- Product variant selection
- Dynamic variant-based pricing
- EMI plans for 6, 12 and 24 months
- Dynamic EMI calculation based on selected variant
- Product details view
- Search products
- Category filtering
- Loading states
- Error and retry handling
- Responsive mobile and desktop UI
- Proceed with EMI interaction
- Existing Shop navigation preserved

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- React Hooks

## Data & API

The Marketplace uses mock API-style data retrieval to simulate dynamic product loading.

Product and variant data are maintained separately from the UI, while pricing and EMI values are calculated dynamically based on the selected product variant.

## EMI Calculation

EMI plans are dynamically generated for:

- 6 months
- 12 months
- 24 months

The monthly amount is calculated based on the selected product variant price.

## Responsive Design

The Marketplace is optimized for:

- Desktop
- Tablet
- Mobile

The interface was tested on a mobile device to verify responsive layout, product selection, variant pricing, EMI selection and CTA functionality.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vinithreddy123/1fi-marketplace.git