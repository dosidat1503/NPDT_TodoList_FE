import z from "zod";
import { isValid, parse } from "date-fns";

const parseDateString = (value: string) => {
  const parsedDate = parse(value, "HH:mm dd/MM/yyyy", new Date());
  return isValid(parsedDate) ? parsedDate : null;
};

export const TaskInfoSaveSchema = z.object({
  taskID: z.number(),
  taskName: z
    .string()
    .min(1, "Task name is required")
    .max(200, "Task name must be at most 200 characters")
    .refine((value) => value.trim() !== "", {
      message: "Task name cannot be just whitespace",
    }),
  note: z.string(),
  dueDate: z.union([
    z.date(),
    z.string().refine(
      (value) => {
        const parsedDate = parseDateString(value);
        return parsedDate !== null;
      },
      {
        message: "Invalid date format, should be 'HH:mm dd/MM/yyyy'",
      },
    ),
  ]),
  isChangeDate: z.boolean(),
});

export type TaskInfoSave = z.infer<typeof TaskInfoSaveSchema>;
