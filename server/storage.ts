import { 
  Category, InsertCategory,
  Author, InsertAuthor,
  Article, InsertArticle,
  BreakingNews, InsertBreakingNews,
  ArticleWithRelations
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Authors
  getAuthors(): Promise<Author[]>;
  getAuthor(id: number): Promise<Author | undefined>;
  
  // Articles
  getArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
    trending?: boolean;
    editorsPick?: boolean;
  }): Promise<ArticleWithRelations[]>;
  
  getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined>;
  getRelatedArticles(categoryId: number, excludeId: number, limit?: number): Promise<ArticleWithRelations[]>;
  
  // Breaking News
  getBreakingNews(): Promise<BreakingNews[]>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private authors: Map<number, Author>;
  private articles: Map<number, Article>;
  private breakingNewsItems: Map<number, BreakingNews>;
  
  constructor() {
    this.categories = new Map();
    this.authors = new Map();
    this.articles = new Map();
    this.breakingNewsItems = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  // Authors
  async getAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }
  
  async getAuthor(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }
  
  // Articles
  async getArticles(options: {
    limit?: number;
    category?: string;
    featured?: boolean;
    trending?: boolean;
    editorsPick?: boolean;
  } = {}): Promise<ArticleWithRelations[]> {
    let articles = Array.from(this.articles.values());
    
    // Filter by category slug
    if (options.category) {
      const category = await this.getCategoryBySlug(options.category);
      if (category) {
        articles = articles.filter(article => article.categoryId === category.id);
      }
    }
    
    // Filter by featured
    if (options.featured !== undefined) {
      articles = articles.filter(article => article.featured === options.featured);
    }
    
    // Filter by trending
    if (options.trending !== undefined) {
      articles = articles.filter(article => article.trending === options.trending);
    }
    
    // Filter by editor's pick
    if (options.editorsPick !== undefined) {
      articles = articles.filter(article => article.editorsPick === options.editorsPick);
    }
    
    // Sort by published date (newest first)
    articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Limit results
    if (options.limit) {
      articles = articles.slice(0, options.limit);
    }
    
    // Add relations data
    return Promise.all(articles.map(async article => {
      const category = this.categories.get(article.categoryId);
      const author = this.authors.get(article.authorId);
      
      if (!category || !author) {
        throw new Error(`Missing relations for article ${article.id}`);
      }
      
      return {
        ...article,
        category,
        author
      };
    }));
  }
  
  async getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined> {
    const article = Array.from(this.articles.values()).find(
      (article) => article.slug === slug
    );
    
    if (!article) {
      return undefined;
    }
    
    const category = this.categories.get(article.categoryId);
    const author = this.authors.get(article.authorId);
    
    if (!category || !author) {
      throw new Error(`Missing relations for article ${article.id}`);
    }
    
    return {
      ...article,
      category,
      author
    };
  }
  
  async getRelatedArticles(categoryId: number, excludeId: number, limit: number = 3): Promise<ArticleWithRelations[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId && article.id !== excludeId)
      .slice(0, limit);
    
    return Promise.all(articles.map(async article => {
      const category = this.categories.get(article.categoryId);
      const author = this.authors.get(article.authorId);
      
      if (!category || !author) {
        throw new Error(`Missing relations for article ${article.id}`);
      }
      
      return {
        ...article,
        category,
        author
      };
    }));
  }
  
  // Breaking News
  async getBreakingNews(): Promise<BreakingNews[]> {
    return Array.from(this.breakingNewsItems.values())
      .filter(item => item.active)
      .sort((a, b) => b.priority - a.priority);
  }
  
  // Initialize with sample data
  private initializeData() {
    // Categories
    const categoriesData: InsertCategory[] = [
      { name: "World", slug: "world", color: "#D32F2F" },
      { name: "Politics", slug: "politics", color: "#C2185B" },
      { name: "Business", slug: "business", color: "#7B1FA2" },
      { name: "Technology", slug: "technology", color: "#1976D2" },
      { name: "Science", slug: "science", color: "#0097A7" },
      { name: "Health", slug: "health", color: "#388E3C" },
      { name: "Entertainment", slug: "entertainment", color: "#F57C00" },
      { name: "Sports", slug: "sports", color: "#FFA000" },
      { name: "Culture", slug: "culture", color: "#5D4037" },
      { name: "Education", slug: "education", color: "#455A64" }
    ];
    
    categoriesData.forEach((category, index) => {
      this.categories.set(index + 1, {
        ...category,
        id: index + 1
      });
    });
    
    // Authors
    const authorsData: InsertAuthor[] = [
      { 
        name: "Rachel Chen", 
        role: "Senior Correspondent",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      { 
        name: "James Wilson", 
        role: "Technology Reporter",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      { 
        name: "Emily Rodriguez", 
        role: "Business Analyst",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      { 
        name: "Michael Chen", 
        role: "Political Editor",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      }
    ];
    
    authorsData.forEach((author, index) => {
      this.authors.set(index + 1, {
        ...author,
        id: index + 1
      });
    });
    
    // Articles
    const articlesData: InsertArticle[] = [
      {
        title: "Climate Summit Reaches Historic Agreement on Global Emissions Targets",
        slug: "climate-summit-agreement",
        excerpt: "After two weeks of intense negotiations, world leaders have finalized a groundbreaking deal to significantly reduce carbon emissions by 2030.",
        content: "World leaders have reached a historic agreement at the Global Climate Summit, committing to unprecedented reductions in carbon emissions by 2030. The landmark deal, finalized after two weeks of intense negotiations, establishes binding targets for all participating nations and includes financial mechanisms to support developing countries in their transition to cleaner energy sources.\n\nThe agreement represents a significant shift in global climate policy, with major polluters agreeing to more ambitious targets than previously committed to. Environmental experts are calling it a potential turning point in the fight against climate change, though they caution that implementation will be crucial.\n\n\"This is just the beginning of the real work,\" said UN Secretary-General, emphasizing that countries must now translate commitments into concrete policy changes and investments in sustainable infrastructure.\n\nThe summit also established a new framework for monitoring and reporting emissions, which aims to increase transparency and accountability in how nations track their progress toward climate goals.",
        image: "https://images.unsplash.com/photo-1557682250-62777ba7a3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        categoryId: 1,
        authorId: 1,
        featured: true,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 6
      },
      {
        title: "Tech Giant Unveils Revolutionary AI-Powered Device",
        slug: "tech-giant-ai-device",
        excerpt: "A leading technology company has announced a groundbreaking new device that leverages artificial intelligence in unprecedented ways.",
        content: "At its annual developer conference yesterday, tech giant TechCorp unveiled what it's calling a \"revolutionary\" new device powered by advanced artificial intelligence. The product, named Nexus, represents the company's most significant innovation in recent years and is designed to integrate seamlessly with users' daily lives.\n\n\"What we're introducing today will fundamentally change how people interact with technology,\" said TechCorp CEO during the keynote presentation. The device features a novel neural processing unit specifically designed for on-device AI applications, which the company claims is twice as efficient as competing solutions while maintaining user privacy by minimizing cloud dependencies.\n\nAnalysts are cautiously optimistic about the product's potential impact. \"It's certainly impressive technology,\" noted tech industry analyst Sarah Williams, \"but the real test will be how it translates to meaningful user benefits in everyday scenarios.\"\n\nNexus is expected to hit the market in early 2025, with the company currently working with developers to build a robust ecosystem of applications that leverage its unique capabilities.",
        image: "https://images.unsplash.com/photo-1661347334036-d484f970deec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 4,
        authorId: 2,
        featured: true,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 5
      },
      {
        title: "Major Economic Reforms Announced to Combat Inflation",
        slug: "economic-reforms-inflation",
        excerpt: "Government officials have unveiled a comprehensive package of economic measures aimed at controlling rising inflation and stimulating growth.",
        content: "Government officials today announced a sweeping package of economic reforms designed to address persistent inflation and revitalize economic growth. The comprehensive plan includes monetary policy adjustments, tax incentives for businesses, and targeted relief measures for households most affected by rising prices.\n\n\"These reforms represent a balanced approach to a complex economic challenge,\" said the Finance Minister during a press conference. \"We're taking decisive action to ensure price stability while creating conditions for sustainable growth.\"\n\nThe central bank will implement a series of measured interest rate increases over the next six months, while the treasury will introduce tax credits for businesses that invest in domestic manufacturing and supply chain improvements.\n\nEconomists have offered mixed reactions to the announcement. Some praise the government's willingness to take bold action, while others question whether the measures are sufficient to address structural economic challenges.\n\n\"The reforms address important short-term concerns,\" said economist Dr. Martin Reynolds, \"but the longer-term issues of productivity and workforce development will require additional policy interventions.\"",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: 3,
        authorId: 3,
        featured: true,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 8
      },
      {
        title: "New Space Mission Set to Launch Next Month",
        slug: "space-mission-launch",
        excerpt: "Scientists prepare for groundbreaking mission to explore distant planets with advanced instruments.",
        content: "Space agencies worldwide are making final preparations for next month's launch of the Horizon Explorer mission, which aims to revolutionize our understanding of distant planetary systems. The spacecraft, equipped with next-generation observational instruments, will travel to previously unexplored regions of our solar system before using a gravitational slingshot maneuver to accelerate toward its primary targets.\n\n\"This mission represents the culmination of decades of scientific and engineering advancement,\" said mission director Dr. Elena Kovalev. \"The data we expect to collect could fundamentally alter our understanding of planetary formation and the potential for life beyond Earth.\"\n\nThe Horizon Explorer carries seven specialized scientific instruments, including an advanced spectrometer capable of detecting atmospheric compositions with unprecedented precision and a deep-space radar system that can penetrate the surfaces of distant objects.\n\nThe international collaboration behind the mission includes scientists from twelve countries who will work together to analyze the data transmitted back to Earth. Initial findings are expected approximately eight months after launch, once the spacecraft reaches its first major observation point.",
        image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 5,
        authorId: 4,
        featured: false,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 4
      },
      {
        title: "Breakthrough in Medical Research Offers Hope",
        slug: "medical-research-breakthrough",
        excerpt: "Researchers announce promising results from clinical trials on treatment for chronic conditions.",
        content: "Medical researchers have announced a significant breakthrough in the treatment of several chronic inflammatory conditions, following successful completion of Phase II clinical trials. The novel therapeutic approach, which targets specific immune pathways previously not addressed by existing treatments, has shown remarkable efficacy in reducing symptoms and improving quality of life for patients.\n\n\"These results exceeded our expectations,\" said lead researcher Dr. Sarah Martinez. \"Patients who had exhausted all other treatment options experienced meaningful improvement, some for the first time in years.\"\n\nThe treatment utilizes a proprietary combination of monoclonal antibodies that selectively inhibit key inflammatory cascades while preserving essential immune functions. This targeted approach appears to minimize the side effects commonly associated with broader immunosuppressive therapies.\n\nThe research team is now preparing for larger Phase III trials, which will involve multiple medical centers across the country. If these trials confirm the initial findings, the treatment could receive regulatory approval within the next two to three years.\n\n\"While we remain cautiously optimistic, these early results suggest we may be on the verge of a significant advance in how we treat a range of challenging chronic conditions,\" Dr. Martinez added.",
        image: "https://images.unsplash.com/photo-1560416313-414b33c856a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 6,
        authorId: 1,
        featured: false,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 5
      },
      {
        title: "Underdog Team Clinches Championship in Dramatic Finale",
        slug: "underdog-team-championship",
        excerpt: "In a stunning upset, the underdogs overcame all odds to win their first championship in decades.",
        content: "In what sports commentators are already calling one of the greatest upsets in recent sports history, the underdog Metropolitan Falcons defeated the heavily favored Western Titans last night to claim their first championship title in 27 years. The decisive game, which went into overtime, culminated in a breathtaking final play that secured the Falcons' unlikely victory.\n\n\"Nobody believed in us except the people in that locker room,\" said Falcons team captain Marcus Johnson, who led his team with a career-best performance. \"We've been counted out all season, and that just fueled our determination.\"\n\nThe Falcons, who began the season with five consecutive losses and were widely predicted to finish at the bottom of the standings, staged a remarkable turnaround mid-season after several key tactical adjustments implemented by first-year head coach Sophia Rodriguez.\n\n\"Coach Rodriguez changed the culture of this team,\" Johnson explained. \"She convinced us to believe in ourselves and in a system that plays to our unique strengths rather than trying to imitate what other teams are doing.\"\n\nThe championship victory caps what many sports analysts are describing as one of the most improbable comeback stories in professional sports, with the team's journey from last place to champions already being discussed as potential material for a documentary or feature film.",
        image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 8,
        authorId: 2,
        featured: false,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 3
      },
      {
        title: "Annual Cultural Festival Draws Record Attendance",
        slug: "cultural-festival-record-attendance",
        excerpt: "The week-long celebration showcased diverse traditions and attracted visitors from around the world.",
        content: "The International Cultural Festival concluded yesterday with organizers announcing record-breaking attendance figures, with over 250,000 visitors participating in the week-long celebration of global arts, music, cuisine, and traditions. The festival, now in its fifteenth year, featured delegations from 47 countries presenting their unique cultural heritage through performances, exhibitions, and interactive experiences.\n\n\"What we've witnessed this year is truly remarkable,\" said festival director Elena Patel. \"In a time of increasing global tensions, this festival has demonstrated how cultural exchange can build bridges and foster mutual understanding between diverse communities.\"\n\nHighlights of this year's festival included an unprecedented collaboration between classical musicians from three continents, a comprehensive exhibition of indigenous textile arts, and a series of moderated dialogues on cultural preservation in the digital age.\n\nThe economic impact of the festival has also been significant for the host city, with local businesses reporting substantial increases in revenue during the event. Hotel occupancy reached 97% during the main weekend, and restaurants near festival venues experienced wait times of up to three hours.\n\n\"Beyond the cultural significance, this has become a vital economic engine for our region,\" noted the city's mayor during the closing ceremony. \"We're already looking forward to next year's festival, which promises to be even more expansive.\"",
        image: "https://images.unsplash.com/photo-1601933513793-1f95b442415f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 9,
        authorId: 3,
        featured: false,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 4
      },
      {
        title: "Key Legislation Passes After Months of Debate",
        slug: "key-legislation-passes",
        excerpt: "Lawmakers finally reach consensus on controversial bill addressing major social issues.",
        content: "After months of intense debate and negotiation, lawmakers have finally passed a comprehensive piece of legislation addressing several pressing social and economic issues. The bill, which required bipartisan support to overcome procedural hurdles, represents a rare moment of cooperation in an otherwise divided political landscape.\n\n\"This legislation isn't perfect, but it's a significant step forward,\" said Senate Majority Leader in a statement following the vote. \"It demonstrates that despite our differences, we can still come together to address the needs of the American people.\"\n\nThe package includes provisions for infrastructure investment, healthcare accessibility improvements, and educational reform, with funding mechanisms designed to minimize impact on the federal deficit. Several controversial provisions were modified or removed during the negotiation process to secure necessary votes from moderate legislators.\n\nPolicy analysts have offered mixed assessments of the legislation's potential impact. \"There are meaningful advances in several key areas,\" noted political scientist Dr. James Morton, \"but some of the compromises may limit the effectiveness of certain programs.\"\n\nImplementation of the various provisions will begin immediately, though some aspects of the legislation will be phased in over the next three years to allow agencies time to develop appropriate regulatory frameworks.",
        image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 2,
        authorId: 4,
        featured: false,
        trending: true,
        editorsPick: false,
        published: true,
        readTime: 6
      },
      {
        title: "International Peace Talks Resume After Months of Diplomatic Standoff",
        slug: "peace-talks-resume",
        excerpt: "Diplomats from opposing nations have agreed to return to the negotiation table following intense behind-the-scenes efforts by international mediators.",
        content: "Diplomatic representatives from two long-standing adversaries have agreed to resume peace negotiations following a months-long impasse that had raised concerns about regional stability. The breakthrough comes after intensive mediation efforts by a coalition of neutral nations and international organizations.\n\n\"This return to dialogue represents a critical opportunity to deescalate tensions and work toward a sustainable resolution,\" said the UN Secretary-General's special envoy to the region. \"While significant challenges remain, the willingness of both parties to reengage in good-faith negotiations is an important first step.\"\n\nThe talks will initially focus on humanitarian issues and confidence-building measures before addressing more contentious territorial and security matters. A neutral third country has been selected to host the discussions, with the first round scheduled to begin next month.\n\nDiplomatic observers caution that previous attempts at negotiation have broken down multiple times over the past decade, though some note that changing regional dynamics and economic pressures may create new incentives for compromise.\n\n\"There's reason for cautious optimism,\" said international relations expert Professor Maria Katsaros. \"Both governments are facing domestic challenges that could be alleviated by a reduction in international tensions, potentially creating a window of opportunity for meaningful progress.\"",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        categoryId: 1,
        authorId: 1,
        featured: false,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 4
      },
      {
        title: "New Privacy Regulations Could Reshape Digital Advertising Industry",
        slug: "privacy-regulations-digital-advertising",
        excerpt: "Experts predict significant changes to how online platforms collect and use data following the introduction of sweeping new privacy laws.",
        content: "Digital privacy experts are forecasting major disruptions to the online advertising ecosystem as a new set of comprehensive data protection regulations takes effect next quarter. The legislative framework, which expands on existing privacy laws, introduces stricter limitations on how companies can collect, process, and monetize user data.\n\n\"These regulations represent the most significant shift in digital privacy governance we've seen in the past decade,\" said Alicia Reynolds, director of the Digital Rights Foundation. \"Companies that have built their business models around unrestricted access to user data will need to fundamentally rethink their approaches.\"\n\nKey provisions include enhanced consent requirements, greater transparency in data usage, expanded user rights to access and delete personal information, and substantial penalties for non-compliance that can reach up to 4% of global annual revenue for serious violations.\n\nThe digital advertising industry, which relies heavily on user data for targeted marketing, is expected to experience particular challenges in adapting to the new regulatory environment. Industry associations have expressed concerns about potential revenue impacts, while privacy advocates celebrate the enhanced protections for consumers.\n\n\"There will be short-term adjustment pains,\" acknowledged regulatory compliance attorney Michael Chen, \"but companies that embrace privacy-centric innovation now will likely gain competitive advantages as consumer expectations continue to evolve toward greater data protection.\"",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        categoryId: 4,
        authorId: 2,
        featured: false,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 5
      },
      {
        title: "Major Manufacturers Commit to Carbon-Neutral Production by 2030",
        slug: "manufacturers-carbon-neutral-commitment",
        excerpt: "A coalition of leading global manufacturers has announced ambitious plans to achieve carbon neutrality in their production processes within the decade.",
        content: "A consortium of twelve major global manufacturing companies announced today a joint commitment to achieve carbon neutrality across their production operations by 2030. The initiative, called the Industrial Climate Alliance, represents one of the most ambitious collective climate actions taken by the manufacturing sector to date.\n\n\"This isn't just about corporate responsibility—it's about ensuring our businesses remain viable in a rapidly changing world,\" said Maria Sanchez, CEO of Global Manufacturing Solutions and chairperson of the new alliance. \"Our customers, investors, and employees are demanding climate action, and governments worldwide are implementing stricter emissions regulations.\"\n\nThe participating companies, which collectively operate over 350 production facilities across 40 countries, have committed to a three-phase approach: optimizing energy efficiency, transitioning to renewable energy sources, and offsetting remaining emissions through verified carbon capture projects and sustainable forestry initiatives.\n\nThe alliance will establish a shared technology platform to accelerate the development and implementation of low-carbon production techniques. Members have also committed to transparent reporting of their progress using standardized emissions accounting methodologies.\n\n\"What makes this initiative particularly significant is its scope and the competitive nature of these companies,\" noted climate policy expert Dr. James Wilson. \"These firms are setting aside rivalries to address a common challenge, which speaks to the growing recognition that climate change requires unprecedented collaboration.\"",
        image: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        categoryId: 3,
        authorId: 3,
        featured: false,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 6
      },
      {
        title: "Education Reform Bill Promises to Transform Learning Experience",
        slug: "education-reform-bill",
        excerpt: "Lawmakers have approved a comprehensive education reform package that aims to modernize curriculum and expand access to technology in classrooms.",
        content: "Legislators yesterday passed a sweeping education reform bill that proponents say will fundamentally transform the learning experience for millions of students. The comprehensive package includes provisions for curriculum modernization, expanded technology integration, teacher training enhancements, and measures to address educational inequities in underserved communities.\n\n\"This legislation represents the most significant update to our educational framework in over two decades,\" said the Education Secretary during the bill signing ceremony. \"It acknowledges that preparing students for the rapidly evolving demands of the 21st century requires a fundamental rethinking of how we approach teaching and learning.\"\n\nKey elements of the reform package include the establishment of a national digital education infrastructure to ensure all schools have access to high-speed internet and modern learning technologies, the development of updated curriculum standards with greater emphasis on critical thinking and problem-solving skills, and expanded funding for teacher professional development programs.\n\nThe bill also creates a new grant program specifically targeted at reducing achievement gaps in disadvantaged communities through additional resources, extended learning opportunities, and enhanced family engagement initiatives.\n\n\"While the legislation has received general bipartisan support, education policy experts note that its ultimate impact will depend on implementation details. \"The vision articulated in this bill is commendable,\" said education researcher Dr. Elena Rodriguez, \"but translating that vision into meaningful change in classrooms will require sustained commitment, adequate funding, and thoughtful execution at multiple levels of the education system.\"",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        categoryId: 10,
        authorId: 4,
        featured: false,
        trending: false,
        editorsPick: false,
        published: true,
        readTime: 7
      },
      {
        title: "How Renewable Energy is Transforming Rural Communities",
        slug: "renewable-energy-rural-communities",
        excerpt: "In-depth look at how renewable energy projects are creating economic opportunities and environmental benefits for formerly struggling rural areas.",
        content: "Across the country, renewable energy projects are breathing new life into rural communities that have long faced economic challenges. Wind farms, solar installations, and bioenergy facilities are creating jobs, generating tax revenue for local governments, and providing landowners with stable income streams through leasing arrangements.\n\n\"Five years ago, we were looking at closing our elementary school due to budget constraints,\" said Mayor Eleanor Wilson of Greenfield, a small farming community that now hosts a substantial wind energy development. \"The tax revenue from these turbines has completely transformed our financial outlook. We've not only kept the school open but have upgraded our infrastructure and expanded community services.\"\n\nBeyond direct economic benefits, the renewable energy boom is creating opportunities for workforce development in regions that have experienced population decline as young people sought opportunities elsewhere. Technical colleges in several states have developed specialized training programs to prepare local residents for careers in the growing clean energy sector.\n\n\"I was considering relocating after high school,\" said Marcus Johnson, a recent graduate of Greenfield's technical training program who now works as a wind turbine technician. \"Now I can build a career right here in my hometown, with competitive pay and benefits.\"\n\nEnvironmental benefits are also significant, as communities that once relied heavily on fossil fuels diversify their energy sources. Several rural cooperatives have achieved substantial reductions in carbon emissions while maintaining or even reducing energy costs for their members.\n\n\"We're seeing a paradigm shift in how rural America relates to energy production,\" noted Dr. Jennifer Martinez, who studies rural economic development. \"Areas that were once primarily energy consumers are becoming producers, creating a more distributed and resilient system while addressing climate challenges.\"",
        image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 1,
        authorId: 1,
        featured: false,
        trending: false,
        editorsPick: true,
        published: true,
        readTime: 8
      },
      {
        title: "The Future of Medicine: Gene Editing Technologies Explained",
        slug: "gene-editing-technologies-explained",
        excerpt: "Comprehensive analysis of how CRISPR and other gene editing technologies are revolutionizing treatment approaches for genetic diseases.",
        content: "Revolutionary gene editing technologies, particularly CRISPR-Cas9, are poised to transform medicine by offering unprecedented abilities to modify genetic material with precision. These advances hold particular promise for treating thousands of genetic disorders that have historically had limited therapeutic options.\n\n\"We're entering an era where we can address the root causes of many diseases rather than just managing symptoms,\" explained Dr. Sandra Rivera, a leading researcher in genetic medicine. \"The ability to precisely edit specific genetic sequences opens entirely new treatment paradigms.\"\n\nCRISPR-Cas9, often described as \"genetic scissors,\" allows scientists to target specific sections of DNA, remove defective genetic code, and potentially replace it with corrected sequences. While early applications focused on single-gene disorders like sickle cell anemia and cystic fibrosis, researchers are increasingly exploring applications for more complex conditions.\n\nClinical trials using gene editing technologies have shown promising results. Last year, researchers reported successful treatment of patients with a rare blood disorder using CRISPR-modified cells, while several trials for other conditions are advancing through clinical phases.\n\nDespite the promise, significant challenges remain. Ensuring the precision of edits to avoid unintended modifications, developing effective delivery mechanisms to reach target cells, and addressing questions of accessibility and cost are active areas of research and policy discussion.\n\n\"The scientific challenges are substantial but solvable,\" noted Dr. James Chen, who specializes in bioethics. \"Equally important are the ethical and societal questions we must address about how these powerful technologies will be deployed, regulated, and made available to patients regardless of economic status.\"",
        image: "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 5,
        authorId: 2,
        featured: false,
        trending: false,
        editorsPick: true,
        published: true,
        readTime: 6
      },
      {
        title: "Workplace Revolution: How Remote Work is Reshaping Corporate Culture",
        slug: "remote-work-reshaping-corporate-culture",
        excerpt: "Exploring the long-term impacts of remote work on company culture, productivity, and the future of office spaces in major cities.",
        content: "The widespread adoption of remote work arrangements, initially forced by the pandemic but now increasingly embraced as a permanent option by many companies, is fundamentally altering corporate cultures and workplace dynamics. Organizations across industries are grappling with questions about collaboration, innovation, employee engagement, and real estate strategy in this evolving landscape.\n\n\"What started as an emergency response has evolved into a strategic rethinking of how work gets done,\" explained Dr. Rebecca Johansen, who studies organizational psychology. \"Companies are discovering that many traditional assumptions about workplace requirements simply don't hold up to scrutiny when tested against actual performance data.\"\n\nResearch indicates that remote workers often report higher job satisfaction and improved work-life balance, while many organizations have maintained or even increased productivity levels despite reduced office occupancy. However, the picture is nuanced, with significant variations across industries, job functions, and individual preferences.\n\n\"We're seeing the emergence of hybrid models that aim to capture the benefits of both in-person and remote work,\" said Michael Torres, chief people officer at a global consulting firm that recently redesigned its workspace strategy. \"Our offices are evolving from places where people come to complete individual tasks to collaborative hubs where teams gather for specific purposes—innovation sessions, relationship building, and complex problem-solving.\"\n\nThis shift is having ripple effects beyond individual companies. Commercial real estate markets in major urban centers are adapting as demand for traditional office space evolves, while suburbs and smaller cities are seeing increased interest as workers prioritize living arrangements over commuting convenience.\n\n\"We're just beginning to understand the long-term implications,\" noted urban planning expert Dr. Sandra Lee. \"This could represent the most significant change in work patterns and urban development since the rise of the suburban office park in the late 20th century.\"",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80",
        categoryId: 3,
        authorId: 3,
        featured: false,
        trending: false,
        editorsPick: true,
        published: true,
        readTime: 7
      }
    ];
    
    articlesData.forEach((article, index) => {
      this.articles.set(index + 1, {
        ...article,
        id: index + 1,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)) // Random date within last 10 days
      });
    });
    
    // Breaking News
    const breakingNewsData: InsertBreakingNews[] = [
      {
        text: "Global climate summit reaches historic agreement on emissions targets",
        active: true,
        priority: 100
      },
      {
        text: "Tech giant unveils revolutionary AI-powered device at annual conference",
        active: true,
        priority: 90
      },
      {
        text: "Major economic reforms announced to combat inflation and boost growth",
        active: true,
        priority: 80
      },
      {
        text: "International peace talks resume after months of diplomatic standoff",
        active: true,
        priority: 70
      }
    ];
    
    breakingNewsData.forEach((item, index) => {
      this.breakingNewsItems.set(index + 1, {
        ...item,
        id: index + 1,
        createdAt: new Date()
      });
    });
  }
}

export const storage = new MemStorage();
