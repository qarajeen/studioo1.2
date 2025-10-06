
const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';
export const services = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capturing moments with a unique perspective, our photography service turns the ordinary into the extraordinary.',
    imageUrl: `${repoName}/sphere15.jpg`,
    imageHint: 'professional camera'
  },
  {
    id: 'videography',
    title: 'Videography',
    description: 'We tell stories through motion, creating compelling visual narratives that resonate deeply with viewers.',
    imageUrl: `${repoName}/s1.jpg`,
    imageHint: 'cinema camera'
  },
  {
    id: 'post-production',
    title: 'Post-Production',
    description: 'Our meticulous editing and color grading process refines raw footage into a polished, cinematic final product.',
    imageUrl: `${repoName}/s3.jpg`,
    imageHint: 'video editing'
  },
  {
    id: '360-tours',
    title: '360° Virtual Tours',
    description: 'Immersive and interactive, our 360° tours offer a captivating way to explore spaces from anywhere in the world.',
    imageUrl: `${repoName}/s4.jpg`,
    imageHint: '360 camera'
  },
  {
    id: 'timelapse',
    title: 'Time-lapse Videos',
    description: 'We condense time to reveal the beauty of change, from construction projects to natural landscapes.',
    imageUrl: `${repoName}/s2.jpg`,
    imageHint: 'cityscape timelapse'
  },
  {
    id: 'photogrammetry',
    title: 'Photogrammetry',
    description: 'Creating detailed 3D models from photographs, turning real-world objects and scenes into digital assets.',
    imageUrl: `${repoName}/2.jpg`,
    imageHint: '3d model scan'
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Empowering the next generation of creators with hands-on workshops and personalized mentorship.',
    imageUrl: `${repoName}/training.jpg`,
    imageHint: 'workshop training'
  },
  {
    id: 'digital-solutions',
    title: 'Digital Solutions',
    description: 'From interactive web experiences to custom software, we build the tools to bring your ideas to life.',
    imageUrl: `${repoName}/digital-solutions.jpg`,
    imageHint: 'web design'
  }
];

