
import { motion } from 'framer-motion';

const MaintenanceIllustration = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full md:w-1/2 flex justify-center items-center"
    >
      <div className="relative">
        {/* Círculo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-md"></div>
        
        {/* SVG ilustrativo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="420"
          height="360"
          viewBox="0 0 600 400"
          fill="none"
          className="relative z-10"
        >
          <motion.path
            d="M288 152L300 136L312 152H288Z"
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
          <motion.rect
            x="294"
            y="152"
            width="12"
            height="40"
            fill="hsl(var(--primary))"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle
            cx="300"
            cy="220"
            r="60"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeDasharray="377"
            strokeDashoffset="377"
            fill="transparent"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
          />
          <motion.circle
            cx="300"
            cy="220"
            r="50"
            stroke="hsl(var(--secondary))"
            strokeWidth="4"
            fill="transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
          <motion.circle
            cx="300"
            cy="220"
            r="6"
            fill="hsl(var(--secondary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4 }}
          />

          {/* Engrenagens */}
          <motion.g
            animate={{ 
              rotate: 360 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ originX: "270px", originY: "180px" }}
          >
            <path
              d="M270 150C284.64 150 296 161.36 296 176C296 190.64 284.64 202 270 202C255.36 202 244 190.64 244 176C244 161.36 255.36 150 270 150ZM270 158C259.77 158 252 165.77 252 176C252 186.23 259.77 194 270 194C280.23 194 288 186.23 288 176C288 165.77 280.23 158 270 158Z"
              fill="hsl(var(--muted-foreground))"
            />
            <path
              d="M270 136V146M252 142L258 150M241 158L250 162M238 176H248M241 194L250 190M252 210L258 202M270 216V206M288 210L282 202M300 194L290 190M302 176H292M300 158L290 162M288 142L282 150"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.g
            animate={{ 
              rotate: -360 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ originX: "350px", originY: "240px" }}
          >
            <path
              d="M350 215C361.05 215 370 223.95 370 235C370 246.05 361.05 255 350 255C338.95 255 330 246.05 330 235C330 223.95 338.95 215 350 215Z"
              fill="hsl(var(--accent))"
              fillOpacity="0.5"
            />
            <path
              d="M350 205V211M338 208L342 214M330 219L336 222M328 231H334M330 245L336 241M338 254L342 248M350 259V253M362 254L359 248M370 245L364 241M372 231H366M370 219L364 222M362 208L359 214"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Laptop/tela estilizado */}
          <motion.path
            d="M200 260H400V320C400 325.52 395.52 330 390 330H210C204.48 330 200 325.52 200 320V260Z"
            fill="hsl(var(--secondary))"
            fillOpacity="0.2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
          
          <motion.path
            d="M180 330H420V340C420 345.52 415.52 350 410 350H190C184.48 350 180 345.52 180 340V330Z"
            fill="hsl(var(--muted))"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />
          
          {/* Código binário */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2 }}
          >
            <text x="220" y="280" fill="hsl(var(--primary))" fontSize="10">01001101 01100001 01101110 01110101</text>
            <text x="220" y="295" fill="hsl(var(--secondary))" fontSize="10">01110100 01100101 01101110 11000011</text>
            <text x="220" y="310" fill="hsl(var(--primary))" fontSize="10">11000111 11000011 01101111 01101111</text>
          </motion.g>
        </svg>
      </div>
    </motion.div>
  );
};

export default MaintenanceIllustration;
