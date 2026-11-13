import { Activity, Target, Star, Clock, Send } from "lucide-react";
import { SectionHeading } from "@/app/components/ui/section-heading";

const activities = [
  {
    icon: <Target size={18} color="var(--dash-accent-text)" />,
    text: (
      <>
        TechCorp viewed your candidate submission
      </>
    ),
    time: "3m ago",
  },
  {
    icon: <Star size={18} color="#06B6D4" />,
    text: (
      <>
        New opportunity: Full Stack Engineer
      </>
    ),
    time: "8m ago",
  },
  {
    icon: <Clock size={18} color="var(--dash-warning-text)" />,
    text: (
      <>
        Rahul Verma availability updated
      </>
    ),
    time: "15m ago",
  },
  {
    icon: <Send size={18} color="var(--dash-success-text)" />,
    text: (
      <>
        Client feedback received for Sneha Iyer
      </>
    ),
    time: "2h ago",
  },
];

export default function VendorLiveActivity() {
  return (
    <div className="dash-card h-full">
      <SectionHeading title="Live Activity" icon={<Activity />} />

      <div className="dash-activity-list">
        {activities.map((item, i) => (
          <div key={i} className="dash-activity-item">
            <div className="dash-activity-icon">{item.icon}</div>
            <div className="dash-activity-content">
              <div className="dash-activity-text">{item.text}</div>
              <div className="dash-activity-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
