````markdown
# RecoverAI
### AI-Powered Recovery & Prevention Platform for Substance Use Disorders

> **Hackathon Project**  
> **Tech Stack:** React.js • Node.js • MongoDB Atlas • OpenAI Agents SDK • OpenAI API • Mem0

---

# Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [The Problem We Are Solving](#the-problem-we-are-solving)
- [Our Solution](#our-solution)
- [Objectives](#objectives)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [AI Architecture](#ai-architecture)
- [Technology Stack](#technology-stack)
- [Memory Architecture](#memory-architecture)
- [Educational Knowledge Base (RAG)](#educational-knowledge-base-rag)
- [Application Workflow](#application-workflow)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Security](#security)
- [Accessibility](#accessibility)
- [Testing Strategy](#testing-strategy)
- [Development Plan](#development-plan)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

# Overview

RecoverAI is an AI-powered recovery companion designed to support individuals navigating Substance Use Disorders (SUD) and the caregivers who support them.

The platform uses Generative AI as its core intelligence engine to deliver personalized, context-aware recovery assistance during moments when users are under high cognitive stress.

Unlike traditional chatbot-based systems, RecoverAI is built around an **AI Recovery Agent** capable of remembering user preferences, understanding emotional context, retrieving medically accurate information, and generating personalized interventions.

The experience is designed to be **Voice First**, enabling users to receive immediate support without needing to type.

---

# Problem Statement

Substance Use Disorders affect millions of people worldwide.

During periods of craving, withdrawal, relapse, or emotional distress, users often experience:

- High cognitive overload
- Difficulty making rational decisions
- Inability or unwillingness to type
- Lack of immediate personalized guidance
- Forgetting previously learned coping mechanisms
- Isolation from caregivers

Caregivers also face challenges:

- Limited visibility into recovery progress
- Uncertainty about how to help
- Delayed awareness during emergencies

Most existing applications provide either:

- Static educational content
- Generic AI chatbots

Neither approach offers personalized, contextual, voice-first recovery assistance.

---

# The Problem We Are Solving

RecoverAI addresses these challenges by providing:

- Voice-first recovery assistance
- Personalized AI memory
- Context-aware interventions
- Trusted educational guidance
- Caregiver collaboration
- Intelligent emergency support

The platform focuses on reducing the user's cognitive burden by allowing them to simply speak naturally while the AI handles the rest.

---

# Our Solution

RecoverAI is an intelligent AI Recovery Companion powered by the OpenAI Agents SDK.

Instead of functioning as a traditional chatbot, the Recovery Agent orchestrates multiple AI capabilities including:

- Personalized memory retrieval
- Educational knowledge retrieval
- Risk assessment
- Emergency planning
- Caregiver support

Every conversation is personalized using previous interactions and trusted medical knowledge.

---

# Objectives

- Reduce relapse risk
- Minimize cognitive effort during crises
- Provide personalized AI support
- Improve caregiver involvement
- Deliver medically grounded responses
- Ensure privacy and security
- Maintain accessibility for all users

---

# Core Features

## 🎤 Voice-First Recovery Assistant

Primary interaction is through voice.

Users simply press **Talk** and begin speaking naturally.

The assistant can:

- Hold natural conversations
- Provide emotional support
- Guide grounding exercises
- Suggest recovery techniques
- Answer recovery-related questions

Text input is also supported as an accessibility fallback.

---

## 🧠 Personalized AI Memory

RecoverAI continuously learns user preferences using Mem0.

Examples include:

- Preferred coping strategies
- Recovery milestones
- Emotional triggers
- Therapist recommendations
- Communication preferences
- Recovery goals

This enables future conversations to become increasingly personalized.

---

## 🚨 Personalized Emergency Scripts

When elevated relapse risk is detected, the system generates personalized emergency guidance.

Examples:

- Guided breathing exercises
- Calling trusted contacts
- Personalized motivational reminders
- Grounding activities
- Recovery action plans

---

## ⚠ AI Risk Assessment

Every conversation is analyzed to estimate relapse risk.

Risk levels include:

- Low
- Medium
- High
- Emergency

The detected risk influences the response strategy and available interventions.

---

## 📚 Educational Recovery Assistant

Users can ask recovery-related questions such as:

- What are withdrawal symptoms?
- How can I manage cravings?
- What treatments are available?

Responses are grounded using trusted educational resources retrieved through Vector Search.

---

## 👨‍👩‍👧 Caregiver Dashboard

Caregivers receive appropriate insights including:

- Recovery streak
- Mood trends
- Emergency alerts
- Recovery progress

Private conversations remain confidential unless explicitly shared.

---

## 📈 Recovery Dashboard

Track recovery through:

- Mood history
- Daily journals
- Recovery streaks
- AI-generated insights
- Progress analytics

---

# System Architecture

```text
                    React Frontend
                          │
             Voice (Primary) | Text (Fallback)
                          │
──────────────────────────────────────────────────────

                Express.js Backend API

──────────────────────────────────────────────────────

             OpenAI Recovery Agent SDK

──────────────────────────────────────────────────────

      Memory Tool
      Risk Assessment Tool
      Educational Search Tool
      Emergency Planning Tool

──────────────────────────────────────────────────────

                  MongoDB Atlas

──────────────────────────────────────────────────────

Collections

users
journals
sessions
caregivers
notifications
memories (Mem0)
education_resources (Vector Search)
analytics
```

---

# AI Architecture

RecoverAI uses the OpenAI Agents SDK as its core orchestration engine.

Instead of relying on a single prompt, the Recovery Agent dynamically invokes specialized tools depending on user context.

## Recovery Agent Responsibilities

- Understand user intent
- Retrieve user memories
- Assess emotional risk
- Search educational knowledge
- Generate recovery guidance
- Create emergency plans
- Coordinate caregiver support

---

## Agent Tools

### Memory Tool

Purpose:

Manage long-term personalized memory.

Powered by:

- Mem0

Stores:

- Coping strategies
- Recovery milestones
- Triggers
- Therapy preferences
- Communication style

---

### Educational Search Tool

Purpose:

Retrieve trusted medical information.

Powered by:

- MongoDB Atlas Vector Search
- OpenAI Embeddings

Knowledge Sources:

- WHO
- SAMHSA
- NIDA
- Government recovery resources
- Clinical recovery guidelines

---

### Risk Assessment Tool

Purpose:

Analyze conversations for relapse risk.

Outputs:

- Low
- Medium
- High
- Emergency

---

### Emergency Planning Tool

Purpose:

Generate personalized intervention plans.

Examples:

- Call caregiver
- Guided breathing
- Grounding exercises
- Recovery reminders
- Personalized emergency checklist

---

# Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Framer Motion
- Web Speech API

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- Socket.IO
- Multer

---

## Database

- MongoDB Atlas
- MongoDB Atlas Vector Search

---

## AI

- OpenAI Responses API
- OpenAI Agents SDK
- GPT Models
- Whisper API
- OpenAI Text-to-Speech
- OpenAI Embeddings

---

## Memory

- Mem0

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# Memory Architecture

RecoverAI separates personalized user memory from educational knowledge.

## User Memory

Managed by Mem0.

Stores:

- Preferred coping strategies
- Recovery milestones
- Emotional triggers
- Communication preferences
- Therapist recommendations
- Emergency contacts

Purpose:

Allow the AI to remember each user's recovery journey and personalize future conversations.

---

# Educational Knowledge Base (RAG)

Educational content is stored separately from user memories.

Vector Search is performed using MongoDB Atlas.

Knowledge Sources include:

- WHO
- SAMHSA
- NIDA
- Government recovery guidelines
- Clinical documentation

This ensures AI responses remain medically grounded while minimizing hallucinations.

---

# Application Workflow

## Voice Interaction

```text
User Speaks

↓

Speech-to-Text

↓

Recovery Agent

↓

Retrieve User Memory

↓

Risk Assessment

↓

Educational Search

↓

Generate Personalized Response

↓

Text-to-Speech

↓

Voice Response
```

---

## Text Interaction

```text
User Types

↓

Recovery Agent

↓

Retrieve Memory

↓

Risk Detection

↓

Educational Search

↓

Generate Response

↓

Display Response
```

---

# Database Design

## Users

- Profile
- Preferences
- Recovery goals

---

## Sessions

Stores AI conversations.

---

## Journals

Daily reflections and recovery logs.

---

## Caregivers

Caregiver profiles and permissions.

---

## Notifications

Emergency notifications and reminders.

---

## Memories

Managed through Mem0.

Contains personalized long-term AI memories.

---

## Education Resources

Stores vectorized educational documents for semantic retrieval.

---

## Analytics

Recovery trends and AI-generated insights.

---

# Project Structure

```text
RecoverAI

frontend/

    src/

        components/

        pages/

        hooks/

        services/

        context/

        voice/

        ui/

backend/

    src/

        agents/

            recovery.agent.js

        tools/

            memory.tool.js

            education.tool.js

            risk.tool.js

            emergency.tool.js

        controllers/

        routes/

        middleware/

        models/

        services/

        prompts/

        utils/

        tests/

docs/

README.md
```

---

# Security

RecoverAI prioritizes user privacy and security.

Implemented measures include:

- JWT Authentication
- Password hashing
- HTTPS
- Input validation
- Role-based authorization
- Rate limiting
- Secure environment variables
- Consent-based caregiver access
- Separation of user memory and educational knowledge

---

# Accessibility

Designed for users experiencing cognitive overload.

Accessibility features include:

- Voice-first interaction
- Text fallback
- Large touch targets
- High contrast support
- Screen reader compatibility
- Keyboard navigation
- Responsive design
- Adjustable font sizes

---

# Testing Strategy

## Backend

Tools:

- Jest
- Supertest

Coverage:

- Authentication
- Recovery Agent
- Memory Tool
- Educational Search
- Risk Assessment
- Emergency Tool
- API endpoints

---

## Frontend

Tools:

- React Testing Library
- Vitest

Coverage:

- UI rendering
- Navigation
- Voice interaction
- Accessibility
- Component behavior

---

# Development Plan

## Phase 1 — Project Setup

- Initialize React application
- Initialize Express backend
- Configure MongoDB Atlas
- Configure authentication
- Create base project structure

---

## Phase 2 — AI Foundation

- Configure OpenAI API
- Integrate OpenAI Agents SDK
- Create Recovery Agent
- Build initial conversation flow

---

## Phase 3 — Personalized Memory

- Integrate Mem0
- Store personalized recovery memories
- Retrieve memories during conversations

---

## Phase 4 — Educational Search

- Ingest trusted educational resources
- Generate embeddings
- Configure Atlas Vector Search
- Connect Educational Search Tool

---

## Phase 5 — Recovery Intelligence

- Risk assessment
- Emergency script generation
- Personalized recovery plans
- Caregiver workflows

---

## Phase 6 — Frontend Experience

- Dashboard
- Recovery Assistant
- Journal
- Resources
- Caregiver Dashboard
- Analytics

---

## Phase 7 — Testing & Deployment

- Unit testing
- Integration testing
- UI testing
- Accessibility review
- Deploy frontend
- Deploy backend
- Final demo preparation

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

AI

- OpenAI API

Memory

- Mem0

---

# Future Enhancements

- Mobile application
- Offline emergency mode
- Wearable integration
- Calendar integration
- Therapist portal
- Predictive relapse analytics
- Multi-language support
- Community recovery groups
- Recovery progress summaries
- Personalized recovery recommendations

---

# Why RecoverAI?

RecoverAI demonstrates how Generative AI can move beyond simple conversation and become a trusted recovery companion.

By combining:

- Voice-first interaction
- Personalized AI memory
- Context-aware reasoning
- Trusted educational retrieval
- Intelligent emergency planning
- Caregiver collaboration

RecoverAI delivers a practical, secure, and accessible recovery platform designed to provide meaningful support when users need it most.
````
