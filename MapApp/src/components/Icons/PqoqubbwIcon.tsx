import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Flag, 
  Hash, 
  Building2, 
  Languages, 
  Coins, 
  Users, 
  Search,
  MapPin,
  Info,
  Tag
} from 'lucide-react';

interface PqoqubbwIconProps {
  name: 'globe' | 'flag' | 'hash' | 'building' | 'languages' | 'coins' | 'users' | 'search' | 'mapPin' | 'info' | 'tag';
  className?: string;
  animate?: boolean;
}

const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17
    }
  }
};

const pulseVariants = {
  initial: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

const PqoqubbwIcon: React.FC<PqoqubbwIconProps> = ({ 
  name, 
  className = "w-4 h-4", 
  animate = true 
}) => {
  const iconMap = {
    globe: Globe,
    flag: Flag,
    hash: Hash,
    building: Building2,
    languages: Languages,
    coins: Coins,
    users: Users,
    search: Search,
    mapPin: MapPin,
    info: Info,
    tag: Tag
  };

  const IconComponent = iconMap[name];

  if (!animate) {
    return <IconComponent className={className} />;
  }

  return (
    <motion.div
      variants={iconVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="inline-flex items-center justify-center"
    >
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="pulse"
      >
        <IconComponent className={className} />
      </motion.div>
    </motion.div>
  );
};

export default PqoqubbwIcon;