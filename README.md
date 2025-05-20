<div align="center">
  <img src="packages/assets/webManifest/96x96.png" alt="Kairos Logo" width="96" height="96">
  <h1>Kairos - Time Management Platform</h1>
</div>

Kairos is a modern, cloud-based time management platform designed to help you efficiently manage your time and boost productivity. Built with a serverless architecture, Kairos provides a responsive web interface and scalable backend services.

## Project Structure

This is a monorepo containing several packages that work together to form the complete Kairos platform:

### Packages

1. **`/packages/web`** - Frontend Application
   - Built with React, TypeScript, and Material-UI
   - Responsive web interface for managing time and tasks
   - Uses Parcel as the build tool
   - Includes comprehensive testing with Jest and React Testing Library

2. **`/packages/lambdas`** - Backend Services
   - Serverless functions (AWS Lambda)
   - Handles business logic and data processing
   - Uses AWS SDK for interacting with AWS services
   - Built with TypeScript and bundled with esbuild

3. **`/packages/infra`** - Infrastructure as Code
   - Terraform configurations for AWS resources
   - Manages deployment of all cloud resources
   - Handles provisioning of Lambda functions, API Gateway, and other AWS services

4. **`/packages/assets`** - Static Assets
   - Icons and other static resources
   - Web app manifest and other web assets

## Prerequisites

- Node.js (v18 or later)
- Yarn (v1.22 or later)
- AWS Account (for deployment)
- Terraform (for infrastructure management)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kairos.git
   cd kairos
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Development

#### Web Application

```bash
# Navigate to web package
cd packages/web

# Install dependencies (if not already installed)
yarn

# Start development server
yarn start
```

The web application will be available at `http://localhost:1234` by default.

#### Backend Services

```bash
# Navigate to lambdas package
cd packages/lambdas

# Install dependencies (if not already installed)
yarn

# Build Lambda functions
yarn build
```

### Building for Production

To build all packages for production:

```bash
# From the root directory
yarn build
```

This will build both the web application and Lambda functions with production optimizations.

### Testing

Run tests for all packages:

```bash
# Run all tests
yarn test

# Run web tests only
yarn test:web

# Run Lambda tests only
yarn test:lambdas
```

## Deployment

### Infrastructure

1. Configure your AWS credentials
2. Navigate to the infrastructure package:
   ```bash
   cd packages/infra
   ```
3. Initialize Terraform:
   ```bash
   terraform init
   ```
4. Review the execution plan:
   ```bash
   terraform plan
   ```
5. Apply the infrastructure:
   ```bash
   terraform apply
   ```

### Web Application

After building the web application, deploy the contents of `packages/web/dist` to your preferred static hosting service (e.g., AWS S3 + CloudFront, Vercel, Netlify).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

This license allows you to:
- Run the software for any purpose
- Study and modify the source code
- Distribute the original or modified versions (with source code)

It restricts:
- Selling the software as a commercial product
- Distributing closed-source versions

For more details, please see the full [LICENSE](LICENSE) file.

## Author

- **Tomasz Przytula**

## Acknowledgments

- Built with modern web technologies and cloud services
- Inspired by the need for better time management tools
