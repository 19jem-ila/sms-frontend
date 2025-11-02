import React, { useState, useEffect, } from 'react';
import {useNavigate} from "react-router-dom"
import dayjs from "dayjs";
import { useSelector, useDispatch } from 'react-redux';
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Avatar,
  Space,
  Typography,
  Badge,
  List,
  Progress,
  Timeline,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Divider,
  Tooltip,
  Grid
  
} from 'antd';
const {  Paragraph } = Typography;

import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import {createUser} from "../../store/slices/authSlice"
import {
  fetchUsers, updateUser, deleteUser, resetUserPassword} from "../../store/slices/userSlice"
import {fetchStudents, createStudent, updateStudent, deleteStudent}  from  "../../store/slices/studentSlice"
import {getAllClasses, createClass, updateClass, deleteClass} from "../../store/slices/classSlice"
import { getAllTerms, createTerm, updateTerm, deleteTerm} from "../../store/slices/academicTermSlice"
import {getAllGrades, createGrade, updateGrade, deleteGrade} from "../../store/slices/gradeSlice"
import {fetchSubjects, createSubject, updateSubject, deleteSubject} from "../../store/slices/subjectSlice"
import {getAllFees, createFee, updateFee, deleteFee} from "../../store/slices/feeSlice"
import {getAllAttendance, createAttendance, updateAttendance, deleteAttendance} from "../../store/slices/attendanceSlice"

import "./admin.css"

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate()

 // Add this - get screen size
 const { useBreakpoint } = Grid;
 const screens = useBreakpoint();

 // Add this useEffect to handle mobile collapse
 useEffect(() => {
   // Automatically collapse sidebar on mobile devices
   if (screens.xs || screens.sm) {
     setCollapsed(true);
   } else {
     setCollapsed(false);
   }
 }, [screens.xs, screens.sm]); // This will run when screen size changes



  // Redux selectors
  const { user } = useSelector((state) => state.auth);
  const { list: users, loading: usersLoading } = useSelector(state => state.user);
  const { list: students, loading: studentsLoading } = useSelector(state => state.student);
  const { classes, loading: classesLoading } = useSelector(state => state.class);
  const { terms, loading: termsLoading } = useSelector(state => state.term);
  const { grades, loading: gradesLoading } = useSelector(state => state.grade);
  const { subjects, loading: subjectsLoading } = useSelector(state => state.subject);
  const { fees, loading: feesLoading } = useSelector(state => state.fee);
  const { records: attendance, loading: attendanceLoading } = useSelector(state => state.attendance);
  
  // Load initial data
  useEffect(() => {
    loadAllData();
  }, [dispatch]);

  const loadAllData = () => {
    dispatch(fetchUsers());
    dispatch(fetchStudents());
    dispatch(getAllClasses());
    dispatch(getAllTerms());
    dispatch(getAllGrades());
    dispatch(fetchSubjects());
    dispatch(getAllFees());
    dispatch(getAllAttendance());
  };

  // Stats calculation
    const stats = {
    totalStudents: students?.length || 0,
    totalTeachers: users?.filter(user => user.role === 'teacher')?.length || 0,
    totalClasses: classes?.length || 0,
    totalSubjects: subjects?.length || 0,
    pendingFees: fees?.filter(fee => fee.status === 'pending')?.length || 0,
    todayAttendance: attendance?.filter(record => 
      new Date(record.date).toDateString() === new Date().toDateString()
    )?.length || 0
  };

  
  // Menu items
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Students' },
    { key: '3', icon: <TeamOutlined />, label: 'Teachers' },
    { key: '4', icon: <TeamOutlined />, label: 'Classes' },
    { key: '5', icon: <CalendarOutlined />, label: 'Attendance' },
    { key: '6', icon: <BookOutlined />, label: 'Subjects' },
    { key: '7', icon: <BarChartOutlined />, label: 'Grades' },
    { key: '8', icon: <DollarOutlined />, label: 'Fees' },
    { key: '9', icon: <FileTextOutlined />, label: 'Academic Terms' },
  ];


  const handleBackToHome = () => {
    navigate('/');
  };



  
  // CRUD Operations
  const handleCreate = async (values) => {
    
    try {
      // convert Day.js → ISO string if dateOfBirth exists
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString?.() || values.dateOfBirth,
      };

  
      switch (selectedKey) {
        case '2':
          await dispatch(createStudent(data)).unwrap();
          message.success('Student created successfully');
          break;
        case '3':
          await dispatch(createUser(data)).unwrap();
          message.success('Teacher created successfully');
          break;
        case '4':
          await dispatch(createClass(data)).unwrap();
          message.success('Class created successfully');
          break;
        case '5':
          await dispatch(createAttendance(data)).unwrap();
          message.success('Attendance recorded successfully');
          break;
        case '6':
          await dispatch(createSubject(data)).unwrap();
          message.success('Subject created successfully');
          break;
        case '7':
          await dispatch(createGrade(data)).unwrap();
          message.success('Grade created successfully');
          break;
        case '8':
          await dispatch(createFee(data)).unwrap();
          message.success('Fee record created successfully');
          break;
        case '9':
          await dispatch(createTerm(data)).unwrap();
          message.success('Academic term created successfully');
          break;
        default:
          break;
      }
  
      setModalVisible(false);
      form.resetFields();
      loadAllData();
    } catch (error) {
      message.error(`Failed to create: ${error}`);
    }
  };
  
  const handleUpdate = async (values) => {
    try {
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth?.toISOString?.() || values.dateOfBirth,
      };
  
      switch (selectedKey) {
        case '2':
          await dispatch(updateStudent({ id: editingRecord._id, data })).unwrap();
          message.success('Student updated successfully');
          break;
        case '3':
          await dispatch(updateUser({ id: editingRecord._id, data })).unwrap();
          message.success('Teacher updated successfully');
          break;
        case '4':
          await dispatch(updateClass({ id: editingRecord._id, data })).unwrap();
          message.success('Class updated successfully');
          break;
        case '5':
          await dispatch(updateAttendance({ id: editingRecord._id, data })).unwrap();
          message.success('Attendance updated successfully');
          break;
        case '6':
          await dispatch(updateSubject({ id: editingRecord._id, data })).unwrap();
          message.success('Subject updated successfully');
          break;
        case '7':
          await dispatch(updateGrade({ id: editingRecord._id, data })).unwrap();
          message.success('Grade updated successfully');
          break;
        case '8':
          await dispatch(updateFee({ id: editingRecord._id, data })).unwrap();
          message.success('Fee record updated successfully');
          break;
        case '9':
          await dispatch(updateTerm({ id: editingRecord._id, data })).unwrap();
          message.success('Academic term updated successfully');
          break;
        default:
          break;
      }
  
      setModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      loadAllData();
    } catch (error) {
      message.error(`Failed to update: ${error}`);
    }
  };
  

 

  const handleDelete = async (id) => {
    try {
      switch(selectedKey) {
        case '2': // Students
          await dispatch(deleteStudent(id)).unwrap();
          message.success('Student deleted successfully');
          break;
        case '3': // Teachers
          await dispatch(deleteUser(id)).unwrap();
          message.success('Teacher deleted successfully');
          break;
        case '4': // Classes
          await dispatch(deleteClass(id)).unwrap();
          message.success('Class deleted successfully');
          break;
        case '5': // Attendance
          await dispatch(deleteAttendance(id)).unwrap();
          message.success('Attendance record deleted successfully');
          break;
        case '6': // Subjects
          await dispatch(deleteSubject(id)).unwrap();
          message.success('Subject deleted successfully');
          break;
        case '7': // Grades
          await dispatch(deleteGrade(id)).unwrap();
          message.success('Grade deleted successfully');
          break;
        case '8': // Fees
          await dispatch(deleteFee(id)).unwrap();
          message.success('Fee record deleted successfully');
          break;
        case '9': // Academic Terms
          await dispatch(deleteTerm(id)).unwrap();
          message.success('Academic term deleted successfully');
          break;
        default:
          break;
      }
      loadAllData();
    } catch (error) {
      message.error(`Failed to delete: ${error}`);
    }
  };



  const openCreateModal = () => {
    setEditingRecord(null);
    setModalVisible(true);
    form.resetFields();
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setModalVisible(true);
    
    const formValues = { ...record };
    
    // Safely convert date fields
    const dateFields = ['dateOfBirth', 'attendanceDate', 'dueDate', 'paidDate', 'startDate', 'endDate'];
    dateFields.forEach(field => {
      if (record[field]) {
        try {
          formValues[field] = dayjs(record[field]);
        } catch (error) {
          console.warn(`Failed to parse date field ${field}:`, record[field]);
          formValues[field] = null;
        }
      }
    });
    
    form.setFieldsValue(formValues);
  };

  
  

  // Table Columns with Actions
  const getTableColumns = () => {
    const baseColumns = {
      students: [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Class',
          dataIndex: ['class', 'name'], // safely access nested field
          key: 'className',
          render: (_, record) => record.class?.name || 'N/A'
        },
        
        {
          title: 'Status',
          dataIndex: 'isActive', // use the exact key from your backend
          key: 'status',
          render: (isActive) => (
            <Tag color={isActive ? 'green' : 'red'}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
          ),
        },
      ],
      
      
      teachers: [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
          title: 'Status',
          dataIndex: 'isActive', // use the exact key from your backend
          key: 'status',
          render: (isActive) => (
            <Tag color={isActive ? 'green' : 'red'}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
          ),
        },
      ],
       classes : [
        {
          title: 'Class Name',
          dataIndex: 'name', // directly from backend
          key: 'className',
        },
        {
          title: 'Section',
          dataIndex: 'section', // directly from backend
          key: 'gradeLevel',
        },
        {
          title: 'Teacher',
          key: 'teacherName',
          render: (record) => record.teacher?.name || 'N/A', // extract nested name
        },
        {
          title: 'Students',
          key: 'studentCount',
          render: (record) => record.students?.length || 0, // count array length
        },
      ],
      
      attendance: [
        {
          title: 'Student',
          key: 'studentName',
          render: (record) => record.student?.name || 'N/A', // nested student name
        },
        {
          title: 'Date',
          key: 'date',
          render: (record) => new Date(record.attendanceDate).toLocaleDateString(), // format date
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status) => (
            <Tag color={status.toLowerCase() === 'present' ? 'green' : 'red'}>
              {status}
            </Tag>
          ),
        },
        {
          title: 'Class',
          key: 'className',
          render: (record) => record.class?.name || 'N/A', // nested class name
        },
      ],
      
      subjects : [
        {
          title: 'Subject Name',
          key: 'subjectName',
          render: (record) => record.name || 'N/A', // your subject name
        },
        {
          title: 'Code',
          key: 'subjectCode',
          render: (record) => record._id.slice(-6).toUpperCase(), // example: last 6 chars as code
        },
        {
          title: 'Teacher',
          key: 'teacherName',
          render: (record) => record.teacher?.name || 'N/A', // nested teacher name
        },
        {
          title: 'Grade Level',
          key: 'gradeLevel',
          render: (record) => record.class?.name || 'N/A', // nested class name
        },
      ],
      
     
      grades: [
        { 
          title: 'Student', 
          key: 'studentName',
          render: (_, record) => {
            // Safely access student name
            if (typeof record.student === 'string') return record.student;
            if (record.student?.name) return record.student.name;
            return 'N/A';
          }
        },
        { 
          title: 'Subject', 
          key: 'subjectName',
          render: (_, record) => {
            // Safely access subject name
            if (typeof record.subject === 'string') return record.subject;
            if (record.subject?.name) return record.subject.name;
            return 'N/A';
          }
        },
        { 
          title: 'Score', 
          dataIndex: 'score', 
          key: 'score',
          render: (score) => score || 'N/A'
        },
        { 
          title: 'Garde', 
          dataIndex: 'gradeLetter', 
          key: 'gradeLetter',
          render: (gradeLetter) => gradeLetter || 'N/A'
        },
        { 
          title: 'Term', 
          key: 'term',
          render: (_, record) => {
            // Safely access term name
            if (typeof record.term === 'string') return record.term;
            if (record.term?.name) return record.term.name;
            return 'N/A';
          }
        },
      ],
       fees : [
        {
          title: 'Student',
          key: 'studentName',
          render: (record) => record.student?.name || 'N/A', // nested student name
        },
        {
          title: 'Amount',
          key: 'amount',
          render: (record) => record.feeAmount || 0, // fee amount
        },
        {
          title: 'Due Date',
          key: 'dueDate',
          render: (record) => new Date(record.dueDate).toLocaleDateString(), // format date
        },
        {
          title: 'Status',
          key: 'status',
          render: (record) => (
            <Tag
              color={
                record.status.toLowerCase() === 'paid'
                  ? 'green'
                  : record.status.toLowerCase() === 'pending'
                  ? 'orange'
                  : 'red'
              }
            >
              {record.status}
            </Tag>
          ),
        },
        {
          title: 'Payment Method',
          key: 'paymentMethod',
          render: (record) => record.paymentMethod || 'N/A',
        },
        {
          title: 'Paid Date',
          key: 'paidDate',
          render: (record) => record.paidDate ? new Date(record.paidDate).toLocaleDateString() : 'N/A',
        },
        {
          title: 'Term',
          key: 'term',
          render: (record) => record.term?.name || 'N/A',
        },
      ],
      
      terms: [
        {
          title: 'Term Name',
          key: 'termName',
          render: (record) => record.name || 'N/A', // backend's "name"
        },
        {
          title: 'Start Date',
          key: 'startDate',
          render: (record) => new Date(record.startDate).toLocaleDateString(), // format date nicely
        },
        {
          title: 'End Date',
          key: 'endDate',
          render: (record) => new Date(record.endDate).toLocaleDateString(), // format date nicely
        },
        {
          title: 'Status',
          key: 'status',
          render: (record) => {
            const now = new Date();
            const start = new Date(record.startDate);
            const end = new Date(record.endDate);
            const status = start <= now && now <= end ? 'active' : 'inactive';
            return <Tag color={status === 'active' ? 'green' : 'blue'}>{status}</Tag>;
          },
        },
      ]
      
    };



    
    const actionColumn = {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
         
        </Space>
      ),
    };

    const keyMap = {
      '2': 'students',
      '3': 'teachers',
      '4': 'classes',
      '5': 'attendance',
      '6': 'subjects',
      '7': 'grades',
      '8': 'fees',
      '9': 'terms'
    };

    return [...(baseColumns[keyMap[selectedKey]] || []), actionColumn];
  };

  const getTableData = () => {
    const dataMap = {
      '2': students,
      '3': users?.filter(user => user.role === 'teacher'),
      '4': classes,
      '5': attendance,
      '6': subjects,
      '7': grades,
      '8': fees,
      '9': terms
    };
    return dataMap[selectedKey] || [];
  };

  const getModalTitle = () => {
    const titles = {
      '2': 'Student',
      '3': 'Teacher',
      '4': 'Class',
      '5': 'Attendance',
      '6': 'Subject',
      '7': 'Grade',
      '8': 'Fee',
      '9': 'Academic Term'
    };
    return `${editingRecord ? 'Edit' : 'Create'} ${titles[selectedKey]}`;
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
      </>
    );

    switch(selectedKey) {
      case '2': // Students
  return (
    <>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="rollNumber" label="Roll Number" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="address" label="Address" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="parentName" label="Parent Name" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="parentContact" label="Parent Contact" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="class" label="Class" rules={[{ required: true }]}>
        <Select placeholder="Select class">
          {classes?.map(c => (
            <Option key={c._id} value={c._id}>{c.className}</Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );

      case '3': // Teachers
        return (
          <>
            {commonFields}
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select>
                <Option value="teacher">Teacher</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </>
        );
        case '4': // Classes
  return (
    <>
      {/* CLASS NAME */}
      <Form.Item
        name="name"
        label="Class Name"
        rules={[{ required: true, message: 'Please enter the class name' }]}
      >
        <Input placeholder="e.g. Grade 9A" />
      </Form.Item>

      {/* SECTION */}
      <Form.Item
        name="section"
        label="Section"
        rules={[{ required: true, message: 'Please enter the section' }]}
      >
        <Input placeholder="e.g. A" />
      </Form.Item>

      {/* TEACHER */}
      <Form.Item
        name="teacher"
        label="Assign Teacher"
        rules={[{ required: true, message: 'Please select a teacher' }]}
      >
       <Select placeholder="Select a teacher">
  {users
    ?.filter((u) => u.role === 'teacher')
    ?.map((t) => (
      <Option key={t._id} value={t._id}>
        {t.name} ({t.email})
      </Option>
    ))}
</Select>

      </Form.Item>

      {/* STUDENTS */}
      <Form.Item
        name="students"
        label="Assign Students"
        rules={[{ required: false }]}
      >
        <Select
          mode="multiple"
          placeholder="Select students"
          allowClear
        >
          {students?.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
  case '5': // Attendance
  return (
    <>
      {/* Select Student */}
      <Form.Item
        name="student"
        label="Student"
        rules={[{ required: true, message: 'Please select a student' }]}
      >
        <Select placeholder="Select a student">
          {students?.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select Class */}
      <Form.Item
        name="class"
        label="Class"
        rules={[{ required: true, message: 'Please select a class' }]}
      >
        <Select placeholder="Select a class">
          {classes?.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.className}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Attendance Date */}
      <Form.Item
        name="attendanceDate"
        label="Attendance Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* Status */}
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select attendance status' }]}
      >
        <Select placeholder="Select status">
          <Option value="Present">Present</Option>
          <Option value="Absent">Absent</Option>
          <Option value="Late">Late</Option>
        </Select>
      </Form.Item>

      {/* Remarks (Optional) */}
      <Form.Item
        name="remarks"
        label="Remarks"
        rules={[{ required: false }]}
      >
        <TextArea rows={3} placeholder="Optional remarks" />
      </Form.Item>

      {/* Academic Term */}
      <Form.Item
        name="term"
        label="Term"
        rules={[{ required: true, message: 'Please select a term' }]}
      >
        <Select placeholder="Select academic term">
          {terms?.map((t) => (
            <Option key={t._id} value={t._id}>
              {t.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );

  case '6': // Subjects
  return (
    <>
      <Form.Item
        name="name"
        label="Subject Name"
        rules={[{ required: true, message: 'Please enter subject name' }]}
      >
        <Input placeholder="Enter subject name" />
      </Form.Item>

      <Form.Item
        name="teacher"
        label="Teacher"
        rules={[{ required: true, message: 'Please select a teacher' }]}
      >
        <Select placeholder="Select a teacher">
          {users?.filter(u => u.role === 'teacher')?.map(t => (
            <Option key={t._id} value={t._id}>
              {t.name} ({t.email})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="class"
        label="Class"
        rules={[{ required: true, message: 'Please select a class' }]}
      >
        <Select placeholder="Select a class">
          {classes?.map(c => (
            <Option key={c._id} value={c._id}>
              {c.className}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
  case '7': // Grades
  return (
    <>
      {/* Select Student */}
      <Form.Item
        name="student"
        label="Student"
        rules={[{ required: true, message: 'Please select a student' }]}
      >
        <Select placeholder="Select a student">
          {students?.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select Subject */}
      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ required: true, message: 'Please select a subject' }]}
      >
        <Select placeholder="Select a subject">
          {subjects?.map((subj) => (
            <Option key={subj._id} value={subj._id}>
              {subj.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Score */}
      <Form.Item
        name="score"
        label="Score"
        rules={[{ required: true, message: 'Please enter the score' }]}
      >
        <InputNumber min={0} max={100} style={{ width: '100%' }} />
      </Form.Item>

      {/* Select Term */}
      <Form.Item
        name="term"
        label="Term"
        rules={[{ required: true, message: 'Please select a term' }]}
      >
        <Select placeholder="Select term">
          {terms?.map((t) => (
            <Option key={t._id} value={t._id}>
              {t.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Year (optional) */}
      <Form.Item
        name="year"
        label="Year"
      >
        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
      </Form.Item>

      {/* Remarks (optional) */}
      <Form.Item
        name="remarks"
        label="Remarks"
      >
        <TextArea rows={3} placeholder="Optional remarks" />
      </Form.Item>
    </>
  );
  case '8': // Fees
  return (
    <>
      {/* Select Student */}
      <Form.Item
        name="student"
        label="Student"
        rules={[{ required: true, message: 'Please select a student' }]}
      >
        <Select placeholder="Select a student">
          {students?.map(s => (
            <Option key={s._id} value={s._id}>
              {s.name} ({s.rollNumber})
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select Term */}
      <Form.Item
        name="term"
        label="Term"
        rules={[{ required: true, message: 'Please select a term' }]}
      >
        <Select placeholder="Select term">
          {terms?.map(t => (
            <Option key={t._id} value={t._id}>
              {t.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Fee Amount */}
      <Form.Item
        name="feeAmount"
        label="Fee Amount"
        rules={[{ required: true, message: 'Please enter fee amount' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>

      {/* Due Date */}
      <Form.Item
        name="dueDate"
        label="Due Date"
        rules={[{ required: true, message: 'Please select a due date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* Paid Date (optional) */}
      <Form.Item
        name="paidDate"
        label="Paid Date"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* Payment Status */}
      <Form.Item
        name="status"
        label="Payment Status"
        rules={[{ required: true, message: 'Please select payment status' }]}
      >
        <Select placeholder="Select status">
          <Option value="Pending">Pending</Option>
          <Option value="Paid">Paid</Option>
          
        </Select>
      </Form.Item>

      {/* Payment Method */}
      <Form.Item
        name="paymentMethod"
        label="Payment Method"
      >
        <Select placeholder="Select payment method">
          <Option value="Cash">Cash</Option>
          <Option value="Card">Card</Option>
          <Option value="Bank Transfer">Bank Transfer</Option>
        </Select>
      </Form.Item>

      {/* Receipt Number */}
      <Form.Item
        name="receiptNumber"
        label="Receipt Number"
      >
        <Input placeholder="Optional receipt number" />
      </Form.Item>
    </>
  );


  
        case '9': // Academic Terms
  return (
    <>
      <Form.Item
        name="name"
        label="Term Name"
        rules={[{ required: true, message: 'Please enter the term name' }]}
      >
        <Input placeholder="e.g. Term 1" />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: 'Please select a start date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: 'Please select an end date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="year"
        label="Year"
        rules={[{ required: false }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
    </>
  );

  

    }
  };

  // Add this function to render mobile cards
// Add this function to render mobile cards
const renderMobileCards = (data, columns) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '20px' }}>No data available</div>;
  }

  return data.map((record, index) => {
    const dataColumns = columns.filter(col => col.key !== 'actions');
    
    return (
      <div key={record._id || index} className="mobile-card-item">
        {dataColumns.map((column, colIndex) => {
          let value = '';
          let displayValue = '';
          
          // Get value based on selectedKey and column configuration
          switch(selectedKey) {
            case '2': // Students
              if (column.key === 'name') {
                displayValue = record.name || 'N/A';
              } else if (column.key === 'className') {
                displayValue = record.class?.name || 'N/A';
              } else if (column.key === 'grade') {
                displayValue = record.grade?.name || 'N/A';
              } else if (column.key === 'status') {
                value = <Tag color={record.isActive ? 'green' : 'red'}>
                  {record.isActive ? 'Active' : 'Inactive'}
                </Tag>;
              }
              break;
              
            case '3': // Teachers
              if (column.key === 'name') {
                displayValue = record.name || 'N/A';
              } else if (column.key === 'email') {
                displayValue = record.email || 'N/A';
              } else if (column.key === 'role') {
                displayValue = record.role || 'N/A';
              } else if (column.key === 'status') {
                value = <Tag color={record.isActive ? 'green' : 'red'}>
                  {record.isActive ? 'Active' : 'Inactive'}
                </Tag>;
              }
              break;
              
            case '4': // Classes
              if (column.key === 'className') {
                displayValue = record.name || 'N/A';
              } else if (column.key === 'gradeLevel') {
                displayValue = record.section || 'N/A';
              } else if (column.key === 'teacherName') {
                displayValue = record.teacher?.name || 'N/A';
              } else if (column.key === 'studentCount') {
                displayValue = record.students?.length || 0;
              }
              break;
              
            case '5': // Attendance
              if (column.key === 'studentName') {
                displayValue = record.student?.name || 'N/A';
              } else if (column.key === 'date') {
                displayValue = record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString() : 'N/A';
              } else if (column.key === 'status') {
                value = <Tag color={record.status?.toLowerCase() === 'present' ? 'green' : 'red'}>
                  {record.status || 'N/A'}
                </Tag>;
              } else if (column.key === 'className') {
                displayValue = record.class?.name || 'N/A';
              }
              break;
              
            case '6': // Subjects
              if (column.key === 'subjectName') {
                displayValue = record.name || 'N/A';
              } else if (column.key === 'subjectCode') {
                displayValue = record._id ? record._id.slice(-6).toUpperCase() : 'N/A';
              } else if (column.key === 'teacherName') {
                displayValue = record.teacher?.name || 'N/A';
              } else if (column.key === 'gradeLevel') {
                displayValue = record.class?.name || 'N/A';
              }
              break;
              
            case '7': // Grades
  if (column.key === 'studentName') {
    displayValue = record.student?.name || 'N/A'; // Access nested
  } else if (column.key === 'subjectName') {
    displayValue = record.subject?.name || 'N/A'; // Access nested
  } else if (column.key === 'score') {
    displayValue = record.score || 'N/A'; // Use actual field name
  } else if (column.key === 'gradeLetter') {
    displayValue = record.gradeLetter || 'N/A'; // Use actual field name
  } else if (column.key === 'term') {
    displayValue = record.term?.name || 'N/A'; // Access nested
  }
  break;
              
            case '8': // Fees
              if (column.key === 'studentName') {
                displayValue = record.student?.name || 'N/A';
              } else if (column.key === 'amount') {
                displayValue = record.feeAmount ? `$${record.feeAmount}` : '$0';
              } else if (column.key === 'dueDate') {
                displayValue = record.dueDate ? new Date(record.dueDate).toLocaleDateString() : 'N/A';
              } else if (column.key === 'status') {
                value = <Tag color={
                  record.status?.toLowerCase() === 'paid' ? 'green' :
                  record.status?.toLowerCase() === 'pending' ? 'orange' : 'red'
                }>
                  {record.status || 'N/A'}
                </Tag>;
              } else if (column.key === 'paymentMethod') {
                displayValue = record.paymentMethod || 'N/A';
              } else if (column.key === 'paidDate') {
                displayValue = record.paidDate ? new Date(record.paidDate).toLocaleDateString() : 'N/A';
              } else if (column.key === 'term') {
                displayValue = record.term?.name || 'N/A';
              }
              break;
              
            case '9': // Terms
              if (column.key === 'termName') {
                displayValue = record.name || 'N/A';
              } else if (column.key === 'startDate') {
                displayValue = record.startDate ? new Date(record.startDate).toLocaleDateString() : 'N/A';
              } else if (column.key === 'endDate') {
                displayValue = record.endDate ? new Date(record.endDate).toLocaleDateString() : 'N/A';
              } else if (column.key === 'status') {
                const now = new Date();
                const start = record.startDate ? new Date(record.startDate) : new Date();
                const end = record.endDate ? new Date(record.endDate) : new Date();
                const status = start <= now && now <= end ? 'isActive' : 'Inactive';
                value = <Tag color={status === 'isActive' ? 'green' : 'blue'}>{status}</Tag>;
              }
              break;
              
            default:
              displayValue = 'N/A';
          }
          
          // Use the value if it's a React element, otherwise use displayValue
          const finalValue = value || displayValue;
          
          return (
            <div key={colIndex} className="mobile-card-field">
              <span className="mobile-card-label">{column.title}</span>
              <span className="mobile-card-value">{finalValue}</span>
            </div>
          );
        })}
        
        {/* Actions */}
        <div className="mobile-card-actions">
          <Tooltip title="Edit">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
         
        </div>
      </div>
    );
  });
};

const renderContent = () => {
  if (selectedKey === '1') {
    return <DashboardOverview stats={stats} onBackToHome={handleBackToHome} />;
  }

  const tableColumns = getTableColumns();
  const tableData = getTableData();

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={menuItems.find(item => item.key === selectedKey)?.label + ' Management'}
        extra={
          // Only show Add button if NOT in Grades section
          selectedKey !== '7' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Add New
            </Button>
          )
        }
      >
        <div className="responsive-table-container">
          {/* Desktop Table */}
          <div className="desktop-table">
            <Table
              columns={tableColumns}
              dataSource={tableData}
              loading={usersLoading || studentsLoading || classesLoading}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </div>
          
          {/* Mobile Cards */}
          <div className="mobile-cards">
            {renderMobileCards(tableData, tableColumns)}
          </div>
        </div>
      </Card>

      {/* Only show modal if NOT in Grades section */}
      {selectedKey !== '7' && (
        <Modal
          title={getModalTitle()}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
          style={{ maxWidth: '95vw' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingRecord ? handleUpdate : handleCreate}
          >
            {renderFormFields()}
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingRecord ? 'Update' : 'Create'}
                </Button>
                <Button onClick={() => {
                  setModalVisible(false);
                  setEditingRecord(null);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

  return (
    <Layout style={{ minHeight: '100vh', background: '#090909' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ 
          background: '#05032a',
          boxShadow: '2px 0 6px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Space>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#4648fd',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserOutlined style={{ color: 'white' }} />
            </div>
            {!collapsed && (
              <Title level={4} style={{ color: 'white', margin: 0 }}>
                EduManage
              </Title>
            )}
          </Space>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
          style={{ background: '#05032a', border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#121212',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white'
            }}
          />
          
          <Space size="middle">
            <Button type="text" icon={<BellOutlined />} style={{ color: 'white' }} />
            <Button type="text" icon={<SettingOutlined />} style={{ color: 'white' }} />
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text style={{ color: 'white' }}>Admin</Text>
            </Space>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '0', 
          background: '#090909',
          overflow: 'auto'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

const DashboardOverview = ({ stats, onBackToHome }) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  
  return (
    <div style={{ padding: screens.xs ? '16px' : '24px' }}>
      {/* Welcome Section */}
      <Card 
        className="overview-card"
        style={{ 
          marginBottom: '24px',
        
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Welcome back, Admin! 👋
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: screens.xs ? '14px' : '16px', margin: '8px 0 0 0' }}>
              Here's what's happening with your institution today. Manage students, track attendance, and monitor academic progress from your dashboard.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: screens.md ? 'right' : 'left' }}>
            <Button 
              type="default" 
              icon={<HomeOutlined />}
              onClick={onBackToHome}
              size={screens.xs ? "middle" : "large"}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white'
              }}
            >
              Back to Home
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: '#4648fd' }} />}
              valueStyle={{ color: '#4648fd', fontSize: screens.xs ? '28px' : '32px' }}
              suffix={<ArrowRightOutlined style={{ fontSize: '14px', color: '#81f9f9' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Total Teachers"
              value={stats.totalTeachers}
              prefix={<TeamOutlined style={{ color: '#81f9f9' }} />}
              valueStyle={{ color: '#81f9f9', fontSize: screens.xs ? '28px' : '32px' }}
              suffix={<ArrowRightOutlined style={{ fontSize: '14px', color: '#81f9f9' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Total Classes"
              value={stats.totalClasses}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: screens.xs ? '28px' : '32px' }}
              suffix={<ArrowRightOutlined style={{ fontSize: '14px', color: '#81f9f9' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Pending Fees"
              value={stats.pendingFees}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: screens.xs ? '28px' : '32px' }}
              suffix={<ArrowRightOutlined style={{ fontSize: '14px', color: '#81f9f9' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Total Subjects"
              value={stats.totalSubjects}
              prefix={<BookOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: screens.xs ? '28px' : '32px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '100%'
            }}
          >
            <Statistic
              title="Today's Attendance"
              value={stats.todayAttendance}
              prefix={<CalendarOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2', fontSize: screens.xs ? '28px' : '32px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};


export default Dashboard;








