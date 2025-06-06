import AdminDashboard from "../features/admin/Pages/AdminDashboard/AdminDashboard";
import AddCategory from "../features/admin/Pages/Category/AddCategory/AddCategory";
import Category from "../features/admin/Pages/Category/Category";
import Coupon from "../features/admin/Pages/Coupon/Coupon";
import CourseApproved from "../features/admin/Pages/CourseManagement/CourseApproved/CourseApproved";
import EditRequests from "../shared/components/EditRequest";
import PaymentManagement from "../features/admin/Pages/PaymentManagement/PaymentManagement";
import SinglePayment from "../features/admin/Pages/PaymentManagement/SinglePayment";
import PracticeTest from "../features/admin/Pages/PracticeTest";
import ReportAndCompliance from "../features/admin/Pages/ReportAndCompliance/ReportAndCompliance";
import RevenueManagement from "../features/admin/Pages/RevenueManagement";
import TeacherManagement from "../features/admin/Pages/TeacherManagement/TeacherManagement/TeacherManagement";
import TeacherProfile from "../features/admin/Pages/TeacherManagement/TeacherProfile/TeacherProfile";
import CoursePreview from "../features/teacher/Pages/Course/CoursePreview";
import MyCourse from "../features/teacher/Pages/Course/MyCourse";
import AssignmentCreation from "../features/teacher/Pages/Materials/Assignment/AssignmentCreation";
import AssignmentList from "../features/teacher/Pages/Materials/Assignment/AssignmentList";
import { TestList } from "../features/teacher/Pages/Materials/Create Test";
import TestHistory from "../features/teacher/Pages/Materials/Create Test/TestHistory";
import TestUpdate from "../features/teacher/Pages/Materials/Create Test/TestUpdate";
import NoticeCreation from "../features/teacher/Pages/Materials/Notice/NoticeCreation";
import NoticeList from "../features/teacher/Pages/Materials/Notice/NoticeList";
import RecordClass from "../features/teacher/Pages/Materials/RecordClass/RecordClass";
import RecordClassList from "../features/teacher/Pages/Materials/RecordClass/RecordClassList";
import ResourcesCreation from "../features/teacher/Pages/Materials/Resource/ResourcesCreation";
import ResourcesList from "../features/teacher/Pages/Materials/Resource/ResourcesList";
import Routine from "../features/teacher/Pages/Materials/Routine";
import FlashCard from "../features/teacher/Pages/Flashcard/FlashCard";
import ChildFlashCards from "../features/teacher/Pages/Flashcard/ChildFlashCards";
import PracticeTestCreation from "../features/admin/Pages/PracticeTestCreation.tsx";
import SingleQuestionPattern from "../features/admin/Pages/SingleQuestionPattern.tsx";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "course-management",
    element: <MyCourse />,
  },
  {
    path: 'course-preview/:courseId',
    element: <CoursePreview />
  },
  {
    path: "course-approved/:courseId",
    element: <CourseApproved />,
  },

  // materials starts
  // course preview route
  // course material lists route
  {
    path: 'record-class-list',
    element: <RecordClassList />
  },
  {
    path: 'resources-list',
    element: <ResourcesList />
  },
  // test routes
  {
    path: 'test-list',
    element: <TestList />
  },
  {
    path: 'test-history',
    element: <TestHistory />
  },
  // assignment routes
  {
    path: 'assignment-list',
    element: <AssignmentList />
  },
  {
    path: 'routine-list',
    element: <Routine />
  },
  {
    path: 'notice-list',
    element: <NoticeList />
  },
  // materials end

  // individual material
  {
    path: 'course-preview/:courseId',
    element: <CoursePreview />
  },

  // course update routes
  {
    path: 'record-update/:recordId',
    element: <RecordClass />
  },
  {
    path: 'assignment-update/:assignmentId',
    element: <AssignmentCreation />
  },
  {
    path: 'resource-update/:resourceId',
    element: <ResourcesCreation />
  },
  {
    path: 'test-update/:testId',
    element: <TestUpdate />
  },
  {
    path: 'notice-update/:noticeId',
    element: <NoticeCreation />
  },
  // individual material end
  {
    path: "flashcard-management",
    element: <FlashCard />,
  },
  {
    path: "flashcard-management/:flashcardId",
    element: <ChildFlashCards />,
  },
  {
    path: "teacher-management",
    element: <TeacherManagement />,
  },
  {
    path: "teacher-management/profile/:id",
    element: <TeacherProfile />,
  },
  {
    path: "practice-test",
    element: <PracticeTest />,
  },
  {
    path: "practice-test/:qpId",
    element: <SingleQuestionPattern />,
  },
  {
    path: "payment-management",
    element: <PaymentManagement />,
  },
  {
    path: "payment-management/:id",
    element: <SinglePayment />,
  },
  {
    path: "coupon-management",
    element: <Coupon />,
  },
  {
    path: "revenue-management",
    element: <RevenueManagement />,
  },
  {
    path: "category",
    element: <Category />,
  },
  {
    path: "add-category",
    element: <AddCategory />,
  },
  {
    path: "report-compliance",
    element: <ReportAndCompliance />,
  },
  {
    path: "edit-requests",
    element: <EditRequests />,
  },
  {
    path: "practice-test-creation",
    element: <PracticeTestCreation />,
  },
];