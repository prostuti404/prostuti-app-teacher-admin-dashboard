import FlashCard from "../features/teacher/Pages/Flashcard/FlashCard";
import Messages from "../features/teacher/Pages/Messages/index";
import MyCourse from "../features/teacher/Pages/Course/MyCourse";
import Profile from "../features/teacher/Pages/Profile";
import AcademicQuestion from "../features/teacher/Pages/Question Database/AcademicQuestion";
import AddQuestion from "../features/teacher/Pages/Question Database/AddQuestion/AddQuestion";
import AdmissionQuestion from "../features/teacher/Pages/Question Database/AdmissionQuestion";
import JobQuestion from "../features/teacher/Pages/Question Database/JobQuestion";
import QuestionDatabase from "../features/teacher/Pages/QuestionDatabase";
import TeacherDashboard from "../features/teacher/Pages/TeacherDashboard/TeacherDashboard";
import CreateCourse from "../features/teacher/Pages/Course/CreateCourse";
import CourseDetails from "../features/teacher/Pages/Course/CourseDetails";
import CreateLessons from "../features/teacher/Pages/Course/CreateLessons";
import AddCourseMaterial from "../features/teacher/Pages/Course/AddCourseMaterial";
import RecordClass from "../features/teacher/Pages/Materials/RecordClass/RecordClass";
import AssignmentCreation from "../features/teacher/Pages/Materials/Assignment/AssignmentCreation";
import TestCreation from "../features/teacher/Pages/Materials/Create Test/TestCreation";
import ResourcesCreation from "../features/teacher/Pages/Materials/Resource/ResourcesCreation";
import RoutineCreation from "../features/teacher/Pages/Materials/RoutineCreation";
import NoticeCreation from "../features/teacher/Pages/Materials/Notice/NoticeCreation";
import CoursePreview from "../features/teacher/Pages/Course/CoursePreview";
import RecordClassList from "../features/teacher/Pages/Materials/RecordClass/RecordClassList";
import AssignmentList from "../features/teacher/Pages/Materials/Assignment/AssignmentList";
import ResourcesList from "../features/teacher/Pages/Materials/Resource/ResourcesList";
import NoticeList from "../features/teacher/Pages/Materials/Notice/NoticeList";
import TestList from "../features/teacher/Pages/Materials/Create Test/TestList";
import TestUpdate from "../features/teacher/Pages/Materials/Create Test/TestUpdate";
import TestHistory from "../features/teacher/Pages/Materials/Create Test/TestHistory";
import AnswerSheet from "../features/teacher/Pages/Materials/Create Test/AnswerSheet";
import AssignmentSubmissionList from "../features/teacher/Pages/Materials/Assignment/AssignmentSubmissionList";
import ViewAsSubmission from "../features/teacher/Pages/Materials/Assignment/ViewAsSubmission";
import ChildFlashCards from "../features/teacher/Pages/Flashcard/ChildFlashCards";
import Routine from "../features/teacher/Pages/Materials/Routine";
import EditLesson from "../features/teacher/Pages/Course/EditLesson";
import StudentPerformanceList from "../features/teacher/Pages/Materials/StudentPerformance/StudentPerformanceList";
import SingleStudentPerformance from "../features/teacher/Pages/Materials/StudentPerformance/SingleStudentPerformance";
import ProofCheck from "../features/teacher/Pages/ProofCheck.tsx";
import PermissionGuard from "../shared/components/PermissionGuard";

export const teacherRoutes = [
  {
    path: "dashboard",
    element: <TeacherDashboard />,
  },
  {
    path: "my-course",
    element: (
      <PermissionGuard requiredPermission="course">
        <MyCourse />
      </PermissionGuard>
    ),
  },
  {
    path: "messages",
    element: (
      <PermissionGuard requiredPermission="messages">
        <Messages />
      </PermissionGuard>
    ),
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "question-database",
    element: (
      <PermissionGuard requiredPermission="questions">
        <QuestionDatabase />
      </PermissionGuard>
    ),
  },
  // flashcard paths
  {
    path: "flashcard",
    element: (
      <PermissionGuard requiredPermission="flashcard">
        <FlashCard />
      </PermissionGuard>
    ),
  },
  {
    path: "flashcard/:flashcardId",
    element: (
      <PermissionGuard requiredPermission="flashcard">
        <ChildFlashCards />
      </PermissionGuard>
    ),
  },

  // question database paths
  {
    path: "academic-question",
    element: (
      <PermissionGuard requiredPermission="questions">
        <AcademicQuestion />
      </PermissionGuard>
    ),
  },
  {
    path: "admission-question",
    element: (
      <PermissionGuard requiredPermission="questions">
        <AdmissionQuestion />
      </PermissionGuard>
    ),
  },
  {
    path: "job-question",
    element: (
      <PermissionGuard requiredPermission="questions">
        <JobQuestion />
      </PermissionGuard>
    ),
  },
  {
    path: "add-question",
    element: (
      <PermissionGuard requiredPermission="questions">
        <AddQuestion />
      </PermissionGuard>
    ),
  },

  // course preview route
  {
    path: "course-preview/:courseId",
    element: (
      <PermissionGuard requiredPermission="course">
        <CoursePreview />
      </PermissionGuard>
    ),
  },
  {
    path: "edit-lessons",
    element: (
      <PermissionGuard requiredPermission="course">
        <EditLesson />
      </PermissionGuard>
    ),
  },

  // course update routes
  {
    path: "record-update/:recordId",
    element: <RecordClass />,
  },
  {
    path: "assignment-update/:assignmentId",
    element: <AssignmentCreation />,
  },
  {
    path: "resource-update/:resourceId",
    element: <ResourcesCreation />,
  },
  {
    path: "test-update/:testId",
    element: <TestUpdate />,
  },
  {
    path: "notice-update/:noticeId",
    element: <NoticeCreation />,
  },
  {
    path: "routine",
    element: <Routine />,
  },
  {
    path: "student-performance/:studentId",
    element: <SingleStudentPerformance />,
  },

  // course material lists route
  {
    path: "record-class-list",
    element: <RecordClassList />,
  },
  {
    path: "resources-list",
    element: <ResourcesList />,
  },
  // test routes
  {
    path: "test-list",
    element: <TestList />,
  },
  {
    path: "test-history",
    element: <TestHistory />,
  },
  {
    path: "answer-sheet/:testHistoryId",
    element: <AnswerSheet />,
  },
  // assignment routes
  {
    path: "assignment-list",
    element: <AssignmentList />,
  },
  {
    path: "assignment-submission-list",
    element: <AssignmentSubmissionList />,
  },
  {
    path: "assignment-submission-list/:assignmentHistoryId",
    element: <ViewAsSubmission />,
  },
  {
    path: "routine-list",
    element: <Routine />,
  },
  {
    path: "notice-list",
    element: <NoticeList />,
  },
  {
    path: "student-performance-list",
    element: <StudentPerformanceList />,
  },

  // course paths
  {
    path: "create-course",
    element: (
      <PermissionGuard requiredPermission="course">
        <CreateCourse />
      </PermissionGuard>
    ),
    children: [
      {
        path: "create-course",
        element: <CourseDetails />,
      },
      {
        path: "create-lessons",
        element: <CreateLessons />,
      },
      {
        path: "add-course-material",
        element: <AddCourseMaterial />,
      },
      {
        path: "course-preview",
        element: <CoursePreview />,
      },
    ],
  },

  // course material routes
  {
    path: "record-class",
    element: <RecordClass />,
  },
  {
    path: "assignment",
    element: <AssignmentCreation />,
  },
  {
    path: "test-creation",
    element: <TestCreation />,
  },
  {
    path: "resources",
    element: <ResourcesCreation />,
  },
  {
    path: "routine",
    element: <RoutineCreation />,
  },
  {
    path: "notice",
    element: <NoticeCreation />,
  },
  {
    path: "proof-check",
    element: (
      <PermissionGuard requiredPermission="proof_check">
        <ProofCheck />
      </PermissionGuard>
    ),
  },
];
