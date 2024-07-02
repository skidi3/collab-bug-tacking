// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-commerce Website',
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
      pages: {
        create: [
          {
            name: 'Homepage',
            htmlContent: '<h1>Welcome to our store</h1><p>Check out our latest products!</p>',
            bugs: {
              create: [
                {
                  x: 10,
                  y: 20,
                  selector: 'h1',
                  comments: {
                    create: [
                      {
                        content: 'The heading font size seems too small.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Product Listing',
            htmlContent: '<h2>Our Products</h2><ul><li>Product 1</li><li>Product 2</li></ul>',
            bugs: {
              create: [
                {
                  x: 30,
                  y: 40,
                  selector: 'ul',
                  comments: {
                    create: [
                      {
                        content: 'The product list is not aligned properly.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      chats: {
        create: [
          {
            content: "Hi team, how's the progress on the homepage?",
            userId: user1.id,
          },
          {
            content: "We're almost done with the layout. Will update soon.",
            userId: user2.id,
          },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Task Management App',
      users: {
        connect: [{ id: user1.id }],
      },
      pages: {
        create: [
          {
            name: 'Dashboard',
            htmlContent: '<h1>Your Tasks</h1><div id="task-list"></div>',
            bugs: {
              create: [
                {
                  x: 15,
                  y: 25,
                  selector: '#task-list',
                  comments: {
                    create: [
                      {
                        content: 'The task list is not updating in real-time.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      chats: {
        create: [
          {
            content: "Let's discuss the new feature for task prioritization.",
            userId: user1.id,
          },
        ],
      },
    },
  })

  console.log({ user1, user2, project1, project2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })