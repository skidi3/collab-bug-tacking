// server.ts

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { Bug, Comment, Chat } from '../shared';

config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
});

app.use(express.json());

// Get all projects for a user
app.get('/api/projects', async (req, res) => {
  // TODO: Get user ID from authentication
  const userId = 'clxvnlc3v0000ikcfrk11tbx1';
  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        pages: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get project by ID
app.get('/api/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        pages: true,
      },
    });
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Get bugs for a specific page
app.get('/api/page/:id/bugs', async (req, res) => {
  const { id } = req.params;
  try {
    const bugs = await prisma.bug.findMany({
      where: { pageId: id },
    });
    res.json(bugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching bugs' });
  }
});

// GET /api/bug/:bugId/comments
app.get('/api/bug/:bugId/comments', async (req, res) => {
  const { bugId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { bugId },
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// POST /api/bug/:bugId/comments
app.post('/api/bug/:bugId/comments', async (req, res) => {
  const { bugId } = req.params;
  const { content } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        bugId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('addBug', async (bug: Omit<Bug, 'id' | 'comments'>) => {
    try {
      const newBug = await prisma.bug.create({
        data: {
          x: bug.x,
          y: bug.y,
          selector: bug.selector,
          page: { connect: { id: bug.pageId } }
        }
      });
      io.emit('newBug', newBug);
    } catch (error) {
      console.error('Error creating bug:', error);
    }
  });

  socket.on('addComment', async (comment: Omit<Comment, 'id'>) => {
    try {
      const newComment = await prisma.comment.create({ data: comment });
      io.emit('newComment', newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  });

  socket.on('chatMessage', async (chat: Omit<Chat, 'id' | 'createdAt'>) => {
    try {
      const newChat = await prisma.chat.create({
        data: {
          content: chat.content,
          project: { connect: { id: chat.projectId } },
          userId: chat.userId
        }
      });
      io.emit('newChatMessage', newChat);
    } catch (error) {
      console.error('Error creating chat message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));