# DeepScience 🧬

DeepScience is an open-source AI-powered research assistant that helps researchers and academics explore scientific literature more efficiently. Built with modern web technologies and AI capabilities, it provides an intuitive interface for searching, analyzing, and understanding academic papers.

## 🌟 Features

- **Smart Search**: Advanced search functionality powered by AI to find relevant academic papers
- **Real-time Analysis**: Stream processing of search results for faster response times
- **Interactive UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **AI-Powered Insights**: Leverages OpenAI and LangChain for intelligent paper analysis
- **Docker Support**: Easy deployment with containerization

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Installation

1. Clone the repository:
```bash
git clone https://github.com/eylernur/deepscience.git
cd deepscience
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables file and configure it:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env` with your API keys and settings:
```env
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENALEX_API_URL=https://api.openalex.org
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

#### Docker Setup

1. Configure environment variables:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your production settings:
```env
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# Application Configuration
NEXT_PUBLIC_APP_URL=http://your-domain.com
OPENALEX_API_URL=https://api.openalex.org
NODE_ENV=production
```

3. Build the Docker image:
```bash
docker-compose build
```

4. Run the container:
```bash
# Run in detached mode
docker-compose up -d

# Or run in the foreground
docker-compose up
```

5. The application will be available at http://localhost:3000 (or your configured domain)

#### Docker Commands Reference

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart containers
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

#### Production Deployment with Docker

For production deployment, consider:
1. Using a reverse proxy (like Nginx) for SSL termination
2. Setting up container monitoring
3. Implementing proper logging
4. Using Docker volumes for persistent data
5. Setting up container orchestration (e.g., Kubernetes) for scaling

## 📁 Project Structure

```
deepscience/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions and configurations
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── docs/            # Documentation
└── docker/          # Docker configuration files
```

## 🤝 Contributing

We welcome contributions to DeepScience! Please feel free to submit issues, fork the repository and create pull requests for any improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for their powerful AI models
- The Next.js team for the amazing framework
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help with DeepScience, please:
- Open an issue in the GitHub repository
- Contact the maintainers

---

Made with ❤️ by the Eyler Nur
