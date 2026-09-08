import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // --- RESOURCES ---
  const resources = [
    {
      id: 'res-1',
      title: 'Istanbulkart Guide',
      description: 'Official guide on how to get a student transport card in Istanbul.',
      category: 'Transportation',
      url: 'https://istanbulkart.istanbul/ogrenci-karti',
      source: 'IBB',
    },
    {
      id: 'res-2',
      title: 'Student Residence Permit',
      description: 'Step-by-step guide for international students applying for ikamet.',
      category: 'Legal',
      url: 'https://e-ikamet.goc.gov.tr/',
      source: 'Directorate of Migration Management',
    },
    {
      id: 'res-3',
      title: 'Museum Pass Student',
      description: 'Discounted access to national museums and historical sites.',
      category: 'Culture',
      url: 'https://muze.gov.tr/',
      source: 'Ministry of Culture',
    },
    {
      id: 'res-4',
      title: 'Emergency Numbers in Turkey',
      description: 'A comprehensive list of emergency contacts including Ambulance (112) and Police (155).',
      category: 'Emergency',
      url: 'https://example.com/emergency',
      source: 'Ministry of Interior',
    },
    {
      id: 'res-5',
      title: 'Yunus Emre Institute Turkish Courses',
      description: 'Official and verified Turkish language courses for foreigners.',
      category: 'Education',
      url: 'https://yee.org.tr/',
      source: 'Yunus Emre Institute',
    }
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: {
        ...resource,
        lastReviewed: new Date(),
      },
    });
  }

  // --- COMMUNITIES ---
  const communities = [
    {
      id: 'com-1',
      name: 'Istanbul Tech Enthusiasts',
      description: 'A community for developers and tech enthusiasts in Istanbul. Great for networking and learning.',
      category: 'Technology',
      languages: ['English', 'Turkish', 'Arabic'],
      universities: ['Beykoz University', 'Istanbul Technical University', 'Boğaziçi University'],
      interests: ['Software', 'AI', 'Networking'],
      location: 'Istanbul',
      targetAudience: 'Students and Professionals',
      joinUrl: 'https://example.com/join-tech',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-2',
      name: 'International Students Network (ESN)',
      description: 'The biggest student association in Europe. Organizing cultural events and trips.',
      category: 'Social',
      languages: ['English'],
      universities: ['All'],
      interests: ['Culture', 'Travel', 'Socializing'],
      location: 'Istanbul',
      targetAudience: 'Erasmus and International Students',
      joinUrl: 'https://esnturkey.org/',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-3',
      name: 'Turkish Conversation Club',
      description: 'Practice your Turkish with locals in a relaxed cafe setting. Perfect for beginners.',
      category: 'Language',
      languages: ['Turkish', 'English', 'Arabic'],
      universities: [],
      interests: ['Language Learning', 'Culture'],
      location: 'Kadikoy',
      targetAudience: 'Language Learners',
      joinUrl: 'https://example.com/turkish-club',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-4',
      name: 'Yemeni Students Union in Turkey',
      description: 'A supportive community helping Yemeni students navigate their academic and social life in Turkey.',
      category: 'Cultural',
      languages: ['Arabic', 'English'],
      universities: ['Beykoz University', 'Istanbul University'],
      interests: ['Community Support', 'Networking'],
      location: 'Istanbul',
      targetAudience: 'Yemeni Students',
      joinUrl: 'https://example.com/yemeni-students',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-5',
      name: 'GDG Istanbul (Google Developer Group)',
      description: 'Open to everyone interested in Google technologies. Regular meetups and DevFests.',
      category: 'Technology',
      languages: ['Turkish', 'English'],
      universities: ['Istanbul Technical University', 'Yildiz Technical University'],
      interests: ['Software', 'AI', 'Cloud'],
      location: 'Levent',
      targetAudience: 'Developers',
      joinUrl: 'https://gdg.community.dev/gdg-istanbul/',
      newcomerFriendly: false,
      verified: true,
    },
    {
      id: 'com-6',
      name: 'Istanbul Photography Walkers',
      description: 'Explore the historic streets of Istanbul through your lens. Weekend photo walks.',
      category: 'Hobbies',
      languages: ['English', 'Turkish'],
      universities: [],
      interests: ['Photography', 'Art', 'Sightseeing'],
      location: 'Sultanahmet',
      targetAudience: 'Hobbyists',
      joinUrl: 'https://example.com/photo-walks',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-7',
      name: 'Boğaziçi AI Ethics Society',
      description: 'Academic discussions on the ethical implications of artificial intelligence.',
      category: 'Academic',
      languages: ['English'],
      universities: ['Boğaziçi University'],
      interests: ['AI', 'Philosophy', 'Ethics'],
      location: 'Bebek',
      targetAudience: 'Graduate Students',
      joinUrl: 'https://example.com/ai-ethics',
      newcomerFriendly: false,
      verified: false,
    },
    {
      id: 'com-8',
      name: 'Kadikoy Board Games Club',
      description: 'Weekly board game nights. A great way to meet new people without pressure.',
      category: 'Social',
      languages: ['Turkish', 'English'],
      universities: ['Marmara University'],
      interests: ['Board Games', 'Socializing'],
      location: 'Kadikoy',
      targetAudience: 'Anyone',
      joinUrl: 'https://example.com/board-games',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-9',
      name: 'Medical Students Association (TurkMSIC)',
      description: 'National member organization for medical students in Turkey.',
      category: 'Academic',
      languages: ['Turkish', 'English'],
      universities: ['Istanbul University', 'Cerrahpasa'],
      interests: ['Medicine', 'Health', 'Volunteering'],
      location: 'Fatih',
      targetAudience: 'Medical Students',
      joinUrl: 'https://turkmsic.org.tr/',
      newcomerFriendly: false,
      verified: true,
    },
    {
      id: 'com-10',
      name: 'Istanbul Expat Entrepreneurs',
      description: 'Networking and knowledge sharing for foreigners starting businesses in Turkey.',
      category: 'Business',
      languages: ['English'],
      universities: [],
      interests: ['Entrepreneurship', 'Business', 'Networking'],
      location: 'Sisli',
      targetAudience: 'Entrepreneurs',
      joinUrl: 'https://example.com/expat-business',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-11',
      name: 'Beykoz Tech Innovators',
      description: 'A student-led club at Beykoz University focusing on software projects and hackathons.',
      category: 'Technology',
      languages: ['Turkish', 'English'],
      universities: ['Beykoz University'],
      interests: ['Software', 'Hackathons', 'Innovation'],
      location: 'Beykoz',
      targetAudience: 'Beykoz University Students',
      joinUrl: 'https://example.com/beykoz-tech',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-12',
      name: 'Belgrad Forest Hiking Group',
      description: 'Escape the city! Bi-weekly hiking trips to Belgrad Forest and surrounding nature.',
      category: 'Sports & Outdoors',
      languages: ['English', 'Turkish'],
      universities: [],
      interests: ['Hiking', 'Nature', 'Fitness'],
      location: 'Sariyer',
      targetAudience: 'Nature Lovers',
      joinUrl: 'https://example.com/hiking',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-13',
      name: 'Arabic Literature Circle',
      description: 'Monthly book readings and discussions focusing on classical and modern Arabic literature.',
      category: 'Literature',
      languages: ['Arabic'],
      universities: ['Fatih Sultan Mehmet University', 'Istanbul University'],
      interests: ['Literature', 'Reading', 'Culture'],
      location: 'Fatih',
      targetAudience: 'Literature Enthusiasts',
      joinUrl: 'https://example.com/arabic-literature',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-14',
      name: 'Women in Tech Turkey',
      description: 'Empowering women in the technology sector through mentorship and events.',
      category: 'Technology',
      languages: ['Turkish', 'English'],
      universities: ['All'],
      interests: ['Software', 'Career', 'Mentorship'],
      location: 'Istanbul',
      targetAudience: 'Women in Tech',
      joinUrl: 'https://example.com/women-in-tech',
      newcomerFriendly: true,
      verified: true,
    },
    {
      id: 'com-15',
      name: 'Bosphorus Rowing Club',
      description: 'Learn to row on the beautiful Golden Horn. Early morning sessions available.',
      category: 'Sports',
      languages: ['Turkish', 'English'],
      universities: ['Kadir Has University', 'Halic University'],
      interests: ['Sports', 'Rowing', 'Fitness'],
      location: 'Balat',
      targetAudience: 'Sports Enthusiasts',
      joinUrl: 'https://example.com/rowing',
      newcomerFriendly: false,
      verified: true,
    }
  ];

  for (const community of communities) {
    await prisma.community.upsert({
      where: { id: community.id },
      update: {},
      create: {
        ...community,
        lastReviewed: new Date(),
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
