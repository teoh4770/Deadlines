import { BinIcon } from "../../assets";
import { DeadlineItemInterface } from "../../types/types.ts";
import { Button } from "../ui/Button/Button.tsx";
import { DateInput } from "../ui/DateInput/DateInput.tsx";
import { useState } from "react";
import {
  calculateDaysUntilDueDate,
  getFormattedDaysUntilDue,
} from "../../utils";
import { useDeadlines } from "../../hooks";

interface DeadlineItemProps extends DeadlineItemInterface {}

export const DeadlineItem = ({
  id,
  title,
  dueDate,
  color,
}: DeadlineItemProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { updateDeadlineProperty, removeDeadline } = useDeadlines();

  const isDue = calculateDaysUntilDueDate(dueDate) <= 0;
  const remainingDayMessage = getFormattedDaysUntilDue(dueDate);

  function showTitleInput() {
    setIsEditingTitle(true);
  }

  function hideTitleInput() {
    setIsEditingTitle(false);
  }

  function dateChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) {
    const newDueDate = e.target.value;
    updateDeadlineProperty(id, "dueDate", newDueDate);
  }

  function deleteButtonClickHandler(id: string) {
    removeDeadline(id);
  }

  function inputBlurHandler(e: React.FocusEvent<HTMLInputElement>, id: string) {
    const newTitle = e.currentTarget.value;
    updateDeadlineProperty(id, "title", newTitle);
    hideTitleInput();
  }

  function inputKeyUpHandler(
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) {
    if (e.key === "Enter") {
      const newTitle = e.currentTarget.value;
      updateDeadlineProperty(id, "title", newTitle);
      hideTitleInput();
    } else if (e.key === "Escape") {
      hideTitleInput();
    }
  }

  return (
    // flex flex-wrap justify-between items-center
    <div className="deadline__item grid gap-3 sm:flex sm:justify-between py-6 border-b-[3px] border-black last:border-none">
      <div className="flex gap-3">
        <div
          className="deadline__color-indicator inline-block w-[5px] rounded-full"
          style={{
            backgroundColor: `${color}`, // ? why this works?
          }}
        >
          <span className="sr-only">{color}</span>
        </div>
        <div>
          <label onDoubleClick={showTitleInput}>
            {!isEditingTitle && (
              <span
                className={`deadline__title ${
                  isDue ? "text-[#e63946]" : "text-black"
                }`}
              >
                {title}
              </span>
            )}
            {isEditingTitle && (
              <input
                type="text"
                name="title"
                defaultValue={title}
                className="deadline__title-input"
                onKeyUp={(e) => inputKeyUpHandler(e, id)}
                onBlur={(e) => inputBlurHandler(e, id)}
                autoFocus
              />
            )}
          </label>
          <p className="deadline__remaining-day text-[#748ca3]">
            {remainingDayMessage}
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <DateInput
          spanText="Pick deadline's due date"
          hideLabel
          value={dueDate}
          onChange={(e) => dateChangeHandler(e, id)}
        />

        <Button
          type="button"
          aria-label="delete deadline button"
          buttonText="Remove this deadline"
          icon={BinIcon}
          iconOnly
          onClick={() => deleteButtonClickHandler(id)}
        />
      </div>
    </div>
  );
};
