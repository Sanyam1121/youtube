// Sample video data
const videoData = [
  {
    id: 1,
    title: "How to Build a Website in 2024 - Complete Tutorial",
    channel: "Tech Tutorials",
    channelAvatar: "T",
    views: "1.2M views",
    uploadTime: "2 days ago",
    duration: "15:30",
    thumbnail: "https://via.placeholder.com/320x180/ff6b6b/ffffff?text=Web+Tutorial",
    category: "tech",
    likes: "45K",
    description: "Learn how to build a modern website from scratch using HTML, CSS, and JavaScript. This comprehensive tutorial covers everything you need to know.",
    subscribers: "2.1M subscribers"
  },
  {
    id: 2,
    title: "Top 10 Songs of 2024 - Best Music Hits",
    channel: "Music Hub",
    channelAvatar: "M",
    views: "5.8M views",
    uploadTime: "1 week ago",
    duration: "12:45",
    thumbnail: "https://via.placeholder.com/320x180/4ecdc4/ffffff?text=Music+Hits",
    category: "music",
    likes: "120K",
    description: "Discover the most popular songs of 2024. From pop to rock, these are the tracks everyone is talking about.",
    subscribers: "8.5M subscribers"
  },
  {
    id: 3,
    title: "Epic Gaming Moments - Best Plays Compilation",
    channel: "Gaming Zone",
    channelAvatar: "G",
    views: "3.2M views",
    uploadTime: "3 days ago",
    duration: "18:22",
    thumbnail: "https://via.placeholder.com/320x180/45b7d1/ffffff?text=Gaming+Epic",
    category: "gaming",
    likes: "89K",
    description: "Watch the most incredible gaming moments and epic plays from various popular games. These clips will blow your mind!",
    subscribers: "4.7M subscribers"
  },
  {
    id: 4,
    title: "Breaking: Major Tech Company Announces Revolutionary AI",
    channel: "Tech News Daily",
    channelAvatar: "N",
    views: "2.1M views",
    uploadTime: "1 day ago",
    duration: "8:15",
    thumbnail: "https://via.placeholder.com/320x180/96ceb4/ffffff?text=AI+News",
    category: "news",
    likes: "67K",
    description: "Latest breaking news about artificial intelligence breakthrough that could change everything we know about technology.",
    subscribers: "3.2M subscribers"
  },
  {
    id: 5,
    title: "Funny Cat Compilation - Try Not to Laugh Challenge",
    channel: "Comedy Central",
    channelAvatar: "C",
    views: "8.9M views",
    uploadTime: "5 days ago",
    duration: "10:30",
    thumbnail: "https://via.placeholder.com/320x180/feca57/ffffff?text=Funny+Cats",
    category: "comedy",
    likes: "234K",
    description: "The funniest cat videos on the internet! Can you watch this without laughing? We bet you can't!",
    subscribers: "12.3M subscribers"
  },
  {
    id: 6,
    title: "World Cup 2024 - Best Goals and Highlights",
    channel: "Sports World",
    channelAvatar: "S",
    views: "4.5M views",
    uploadTime: "1 week ago",
    duration: "14:20",
    thumbnail: "https://via.placeholder.com/320x180/ff9ff3/ffffff?text=Football+Goals",
    category: "sports",
    likes: "156K",
    description: "Relive the most spectacular goals and moments from the World Cup 2024. These highlights will give you goosebumps!",
    subscribers: "6.8M subscribers"
  },
  {
    id: 7,
    title: "Learn JavaScript in 30 Minutes - Beginner Tutorial",
    channel: "Code Academy",
    channelAvatar: "E",
    views: "890K views",
    uploadTime: "4 days ago",
    duration: "32:15",
    thumbnail: "https://via.placeholder.com/320x180/54a0ff/ffffff?text=JavaScript",
    category: "education",
    likes: "34K",
    description: "Master the basics of JavaScript programming in just 30 minutes. Perfect for beginners who want to start coding.",
    subscribers: "1.9M subscribers"
  },
  {
    id: 8,
    title: "Latest Pop Hits 2024 - Non-Stop Music Mix",
    channel: "Pop Music",
    channelAvatar: "P",
    views: "6.7M views",
    uploadTime: "2 weeks ago",
    duration: "45:30",
    thumbnail: "https://via.placeholder.com/320x180/5f27cd/ffffff?text=Pop+Mix",
    category: "music",
    likes: "189K",
    description: "The hottest pop songs of 2024 in one amazing mix. Perfect for workouts, parties, or just chilling out.",
    subscribers: "9.2M subscribers"
  }
];

// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const videoGrid = document.getElementById('videoGrid');
const categoryPills = document.querySelectorAll('.pill');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalViews = document.getElementById('modalViews');
const modalLikes = document.getElementById('modalLikes');
const modalChannelAvatar = document.getElementById('modalChannelAvatar');
const modalChannelName = document.getElementById('modalChannelName');
const modalChannelSubs = document.getElementById('modalChannelSubs');
const modalDescription = document.getElementById('modalDescription');

// State
let currentCategory = 'all';
let currentSearchTerm = '';
let filteredVideos = [...videoData];

// Initialize the app
function init() {
  renderVideos();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  // Menu toggle
  menuBtn.addEventListener('click', toggleSidebar);
  
  // Search functionality
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  
  // Category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setActiveCategory(pill.dataset.category);
    });
  });
  
  // Modal controls
  closeModal.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });
  
  // Sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// Toggle sidebar
function toggleSidebar() {
  sidebar.classList.toggle('hidden');
  content.classList.toggle('expanded');
}

// Handle search
function handleSearch() {
  currentSearchTerm = searchInput.value.toLowerCase().trim();
  filterAndRenderVideos();
}

// Set active category
function setActiveCategory(category) {
  currentCategory = category;
  
  // Update active pill
  categoryPills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.dataset.category === category) {
      pill.classList.add('active');
    }
  });
  
  filterAndRenderVideos();
}

// Filter and render videos
function filterAndRenderVideos() {
  filteredVideos = videoData.filter(video => {
    const matchesCategory = currentCategory === 'all' || video.category === currentCategory;
    const matchesSearch = currentSearchTerm === '' || 
      video.title.toLowerCase().includes(currentSearchTerm) ||
      video.channel.toLowerCase().includes(currentSearchTerm);
    
    return matchesCategory && matchesSearch;
  });
  
  renderVideos();
}

// Render videos
function renderVideos() {
  videoGrid.innerHTML = '';
  
  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <h3>No videos found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    `;
    return;
  }
  
  filteredVideos.forEach(video => {
    const videoCard = createVideoCard(video);
    videoGrid.appendChild(videoCard);
  });
}

// Create video card
function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.addEventListener('click', () => openVideoModal(video));
  
  card.innerHTML = `
    <div class="video-thumbnail">
      <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
      <div class="video-duration">${video.duration}</div>
    </div>
    <div class="video-info">
      <div class="video-avatar">${video.channelAvatar}</div>
      <div class="video-details">
        <h3 class="video-title">${video.title}</h3>
        <p class="video-channel">${video.channel}</p>
        <p class="video-stats">${video.views} • ${video.uploadTime}</p>
      </div>
    </div>
  `;
  
  return card;
}

// Open video modal
function openVideoModal(video) {
  modalTitle.textContent = video.title;
  modalViews.textContent = video.views;
  modalLikes.textContent = video.likes;
  modalChannelAvatar.textContent = video.channelAvatar;
  modalChannelName.textContent = video.channel;
  modalChannelSubs.textContent = video.subscribers;
  modalDescription.textContent = video.description;
  
  // Set video source (using placeholder for demo)
  modalVideo.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
  
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close video modal
function closeVideoModal() {
  videoModal.classList.remove('active');
  modalVideo.pause();
  modalVideo.currentTime = 0;
  document.body.style.overflow = 'auto';
}

// Responsive sidebar handling
function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('hidden');
    content.classList.add('expanded');
  } else {
    sidebar.classList.remove('hidden');
    content.classList.remove('expanded');
  }
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Handle initial load
window.addEventListener('load', () => {
  handleResize();
});

// Simulate loading more videos (infinite scroll)
function loadMoreVideos() {
  // This would typically fetch more videos from an API
  console.log('Loading more videos...');
}

// Add scroll listener for infinite scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    loadMoreVideos();
  }
});

// Initialize the app
init();

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Animate video cards on hover
  const style = document.createElement('style');
  style.textContent = `
    .video-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .video-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .video-thumbnail {
      transition: transform 0.3s ease;
    }
    
    .video-card:hover .video-thumbnail {
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(style);
  
  // Add ripple effect to buttons
  function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
  
  // Add ripple to buttons
  document.querySelectorAll('button').forEach(addRippleEffect);
  
  // Add CSS for ripple animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);
});
