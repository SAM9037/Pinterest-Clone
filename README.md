# Pinterest Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff4d6d?logo=heart&logoColor=white)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)](https://openjdk.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![Resilience4j](https://img.shields.io/badge/Resilience4j-CircuitBreaker-2C3E50)](https://resilience4j.readme.io)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203-85EA2D?logo=swagger&logoColor=black)](https://swagger.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![Maintained](https://img.shields.io/badge/Maintained-yes-success.svg)](#)

> A full-stack Pinterest clone — React + TanStack Start frontend with a Spring Boot microservice backend.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite 7, TanStack Start, Tailwind CSS v4, shadcn/ui
**Backend:** Spring Boot 3.2, Java 17, Spring Data JPA, MySQL, Resilience4j, ModelMapper, Swagger

## Quick Start

### Frontend
```bash
bun install
bun run dev
```

### Backend
```bash
cd pinterest-backend
mvn spring-boot:run
```

API runs at `http://localhost:8080/pinterest` · Swagger UI at `/swagger-ui.html`.

## Features
- User registration, login, password reset (with Resilience4j circuit breaker)
- Create, browse, search, and delete pins
- Masonry grid feed and per-user profile pages
- LocalStorage fallback when backend is offline

## Contributing
PRs welcome! Open an issue to discuss major changes first.

## License
MIT
