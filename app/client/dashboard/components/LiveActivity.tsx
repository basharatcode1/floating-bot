import {
  Activity,
  UserPlus,
  CheckCircle2,
  Edit2,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { SectionHeading } from "@/app/components/ui/section-heading";

const activities = [
  {
    icon: <UserPlus size={18} />,
    text: (
      <>
        Vendor submitted candidate for <strong>React Developer</strong>
      </>
    ),
    time: "2m ago",
  },
  {
    icon: <CheckCircle2 size={18} color="var(--dash-success-text)" />,
    text: (
      <>
        New match found — <strong>Karan Singh (94%)</strong>
      </>
    ),
    time: "8m ago",
  },
  {
    icon: <Edit2 size={18} color="var(--dash-warning-text)" />,
    text: (
      <>
        <strong>DevOps Engineer</strong> requirement updated
      </>
    ),
    time: "1 hr ago",
  },
  {
    icon: <Calendar size={18} color="var(--dash-accent-text)" />,
    text: (
      <>
        Interview scheduled with <strong>Sara Khan</strong>
      </>
    ),
    time: "35m ago",
  },
  {
    icon: <ThumbsUp size={18} color="#06B6D4" />,
    text: (
      <>
        <strong>Arjun Patel</strong> selected for the next round by team
      </>
    ),
    time: "1h ago",
  },
];

export default function LiveActivity() {
  return (
    <div className="dash-card">
      <SectionHeading
        title="Live Activity"
        icon={<Activity />}
        action={<span className="dash-live-badge">Live</span>}
      />

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
