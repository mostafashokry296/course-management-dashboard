export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Course {
     id?: number;
     courseName: string;
     instructorName: string;
     category: string;
     duration: number;
     price: number;
     status: CourseStatus;
     createdDate: string;
     description?: string;
}