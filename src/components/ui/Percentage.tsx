import React from "react";
import { Label, UIProps } from '../..';
import { useTheme } from "../../Theme";
import { Wrapper } from "./GridSystem";
import { cn } from "../../libs/cn";

type ColorType = "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";
type ShapeType = "bar" | "circle";

interface PercentageBarProps {
  progress: number;
  type: ColorType;
  className: string;
  thickness: number;
  showText: boolean;
  background: ColorType;
  size: number;
  fontSize: number;
}


interface PercentageProps extends UIProps {
  val?: number;
  max?: number;
  min?: number;
  shape?: ShapeType;
  type?: ColorType;
  background?: ColorType;
  thickness?: number;
  showText?: boolean;
  size?: number;
  fontSize?: number;
  label?: string;
}

const colorToken: Record<ColorType, string> = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  light: "muted",
  dark: "foreground",
};

const foregroundToken: Record<ColorType, string> = {
  primary: "primary-foreground",
  secondary: "secondary-foreground",
  success: "success-foreground",
  warning: "warning-foreground",
  danger: "destructive-foreground",
  info: "info-foreground",
  light: "muted-foreground",
  dark: "background",
};

const hsl = (token: string, alpha?: number) =>
  `hsl(var(--rf-${token})${alpha === undefined ? "" : ` / ${alpha}`})`;

const PercentageBar: React.FC<PercentageBarProps> = ({ 
  progress, 
  type,  
  thickness,
  showText,
  background,
  size,
  fontSize,
  className
}) => {
  const trackColor = hsl(colorToken[background], background === "secondary" || background === "light" ? 0.55 : 0.16);
  const fillColor = hsl(colorToken[type]);
  const textColor = progress >= 12 ? hsl(foregroundToken[type]) : hsl("foreground");

  return (
    <div 
      className={cn("relative overflow-hidden rounded-full border border-border shadow-sm", className)}
      style={{ 
        height: `${thickness}px`,
        width: `${size}%`,
        minWidth: size < 100 ? 120 : undefined,
        backgroundColor: trackColor,
      }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${progress}%`, backgroundColor: fillColor }}
      />
      {showText && (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-medium tabular-nums"
          style={{ fontSize: `${fontSize}px`, color: textColor }}
        >
          {progress}%
        </span>
      )}
    </div>
  );
};

const PercentageCircle: React.FC<PercentageBarProps> = ({ 
  progress, 
  type, 
  thickness,  
  showText,
  background,
  size,
  fontSize,
  className,
}) => {
  const radius = size / 2;
  const normalizedRadius = radius - thickness / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * ((100 - progress) / 100);
  const startAngle = -90;
  const trackColor = hsl(colorToken[background], background === "secondary" || background === "light" ? 0.55 : 0.18);
  const fillColor = hsl(colorToken[type]);
  const textColor = hsl("foreground");

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transform: `rotate(${startAngle}deg)`,
            transformOrigin: 'center',
            transition: 'stroke-dashoffset 300ms ease',
          }}
        />
        {showText && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={700}
            fontSize={fontSize}
            fill={textColor}
          >
            {`${progress}%`}
          </text>
        )}
      </svg>
    </span>
  );
};

const Percentage = ({
  val = 0,
  max = 100,
  min = 0,
  shape = "bar",
  type = "primary",
  background = "secondary",
  thickness = 10,
  showText = true,
  size = 100,
  fontSize = 16,  
  label = undefined,
  pre = undefined,
  post = undefined,
  wrapClass = undefined,
  className = undefined
}: PercentageProps) => {
  const theme = useTheme("percentage");
  const range = max - min;
  const progress = range <= 0 ? 0 : Math.round(Math.max(0, Math.min(100, ((val - min) / range) * 100)));
  const finalClassName = className || theme.Percentage?.className || '';

  return (
    <Wrapper className={wrapClass || theme.Percentage?.wrapClass}>
      {pre}
      {label && <Label label={label} />}
      {shape === "bar" 
      ? <PercentageBar
          progress={progress}
          type={type}
          thickness={thickness}
          showText={showText}
          background={background}
          size={size}
          fontSize={fontSize}
          className={finalClassName}
        />
      : <PercentageCircle
          progress={progress}
          type={type}
          thickness={thickness}
          showText={showText}
          background={background}
          size={size}
          fontSize={fontSize}
          className={finalClassName}
        />
      }
      {post}
    </Wrapper>
  );
};

export default Percentage;
