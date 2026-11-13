"use client";

import { MultiSelect } from "@/app/onboarding/components/MultiSelect";
import {
  Category,
  Skill,
} from "@/app/components/auth/onboarding/VendorOnboardingForm";
import { Briefcase } from "lucide-react";

interface CategorySkillsSectionProps {
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  categoriesError?: string;
  skillsError?: string;
  categories: Category[];
  skills?: Skill[];
  onCategoriesStringChange: (selectedNames: string[]) => void;
  onSkillsChange?: (skills: Skill[]) => void;
  allCategories: { id: string; name: string; isCustom?: boolean }[];
  allSkills?: {
    id: string;
    name: string;
    categoryIds: string[];
    isCustom?: boolean;
  }[];
}

export function CategorySkillsSection({
  label = "Tech Stack",
  placeholder = "Search or add tech stack...",
  leftIcon,
  categoriesError,
  categories,
  onCategoriesStringChange,
  allCategories,
}: CategorySkillsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <MultiSelect
          label={label}
          name="categories"
          options={allCategories.map((c) => c.name)}
          value={categories.map((c) =>
            c.isCustom ? `${c.name} (Others)` : c.name,
          )}
          onChange={onCategoriesStringChange}
          error={categoriesError}
          placeholder={placeholder}
          required
          leftIcon={leftIcon || <Briefcase className="w-4 h-4" />}
          showCheckboxes={true}
        />
      </div>
    </div>
  );
}
