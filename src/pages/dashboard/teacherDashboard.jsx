import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from "react-router-dom";
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

// Import only the slices that teachers can access
import {fetchStudents} from "../../store/slices/studentSlice"
import {getAllClasses} from "../../store/slices/classSlice"
import { getAllTerms} from "../../store/slices/academicTermSlice"
import {getAllGrades, createGrade, updateGrade, deleteGrade} from "../../store/slices/gradeSlice"
import {fetchSubjects} from "../../store/slices/subjectSlice"
import {getAllAttendance, createAttendance, updateAttendance, deleteAttendance} from "../../store/slices/attendanceSlice"

import "./admin.css" 

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate()

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

  // Redux selectors - only what teachers can access
  const { user } = useSelector((state) => state.auth);
  const { list: students, loading: studentsLoading } = useSelector(state => state.student);
  const { classes, loading: classesLoading } = useSelector(state => state.class);
  const { terms, loading: termsLoading } = useSelector(state => state.term);
  const { grades, loading: gradesLoading } = useSelector(state => state.grade);
  const { subjects, loading: subjectsLoading } = useSelector(state => state.subject);
  const { records: attendance, loading: attendanceLoading } = useSelector(state => state.attendance);

  console.log(" the classes" , classes)
  
  // Load initial data - only what teachers can access
  useEffect(() => {
    loadTeacherData();
  }, [dispatch]);

  const loadTeacherData = () => {
    dispatch(fetchStudents());
    dispatch(getAllClasses());
    dispatch(getAllTerms());
    dispatch(getAllGrades());
    dispatch(fetchSubjects());
    dispatch(getAllAttendance());
  };

  // Stats calculation for teacher
  const stats = {
    totalStudents: students?.length || 0,
    totalClasses: classes?.length || 0,
    totalSubjects: subjects?.length || 0,
    todayAttendance: attendance?.filter(record => 
      new Date(record.date).toDateString() === new Date().toDateString()
    )?.length || 0,
    pendingGrades: grades?.filter(grade => !grade.submitted)?.length || 0,
    myClasses: classes?.filter(cls => cls.teacher?._id === user?._id)?.length || 0
  };


  
  // Menu items for teacher (removed Users, Fees management)
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Students' },
    { key: '3', icon: <TeamOutlined />, label: 'My Classes' },
    { key: '4', icon: <CalendarOutlined />, label: 'Attendance' },
    { key: '5', icon: <BookOutlined />, label: 'Subjects' },
    { key: '6', icon: <BarChartOutlined />, label: 'Grades' },
    { key: '7', icon: <FileTextOutlined />, label: 'Academic Terms' },
  ];

  const handleBackToHome = () => {
    navigate('/');
  };

  // CRUD Operations - only what teachers can do
  const handleCreate = async (values) => {
    console.log("🧾 Submitted form values:", values);
    try {
      switch(selectedKey) {
        case '4': // Attendance
          await dispatch(createAttendance(values)).unwrap();
          message.success('Attendance recorded successfully');
          break;
        case '6': // Grades
          // Ensure we're sending the correct data structure
          const gradeData = {
            student: values.student,
            subject: values.subject,
            score: values.score,
            grade: values.grade, // You might want to calculate this based on score
            term: values.term,
            year: values.year,
            remarks: values.remarks,
            submitted: true
          };
          await dispatch(createGrade(gradeData)).unwrap();
          message.success('Grade created successfully');
          break;
        default:
          break;
      }
      setModalVisible(false);
      form.resetFields();
      loadTeacherData();
    } catch (error) {
      message.error(`Failed to create: ${error}`);
    }
  };

  const handleUpdate = async (values) => {
    try {
      switch(selectedKey) {
        case '4': // Attendance
          await dispatch(updateAttendance({ id: editingRecord._id, data: values })).unwrap();
          message.success('Attendance updated successfully');
          break;
        case '6': // Grades
          await dispatch(updateGrade({ id: editingRecord._id, data: values })).unwrap();
          message.success('Grade updated successfully');
          break;
        default:
          break;
      }
      setModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      loadTeacherData();
    } catch (error) {
      message.error(`Failed to update: ${error}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      switch(selectedKey) {
        case '4': // Attendance
          await dispatch(deleteAttendance(id)).unwrap();
          message.success('Attendance record deleted successfully');
          break;
        case '6': // Grades
          await dispatch(deleteGrade(id)).unwrap();
          message.success('Grade deleted successfully');
          break;
        default:
          break;
      }
      loadTeacherData();
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
    form.setFieldsValue(record);
  };

  // Table Columns with Actions - modified for teacher permissions
  // Table Columns with Actions - modified for teacher permissions
const getTableColumns = () => {
  const baseColumns = {
    students: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Class',
        dataIndex: ['class', 'name'],
        key: 'className',
        render: (_, record) => record.class?.name || 'N/A'
      },
      
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'status',
        render: (isActive) => (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        ),
      },
    ],
    
    classes: [
      {
        title: 'Class Name',
        dataIndex: 'name',
        key: 'className',
      },
      {
        title: 'Section',
        dataIndex: 'section',
        key: 'gradeLevel',
      },
     
      {
        title: 'Students',
        key: 'studentCount',
        render: (record) => record.students?.length || 0,
      },
    ],
    
    attendance: [
      {
        title: 'Student',
        key: 'studentName',
        render: (record) => record.student?.name || 'N/A',
      },
      {
        title: 'Date',
        key: 'date',
        render: (record) => new Date(record.attendanceDate).toLocaleDateString(),
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
        render: (record) => record.class?.name || 'N/A',
      },
    ],
    
    subjects: [
      {
        title: 'Subject Name',
        key: 'subjectName',
        render: (record) => record.name || 'N/A',
      },
      {
        title: 'Code',
        key: 'subjectCode',
        render: (record) => record._id?.slice(-6).toUpperCase() || 'N/A',
      },
      {
        title: 'Class',
        key: 'gradeLevel',
        render: (record) => record.class?.name || 'N/A',
      },
    ],
    
    grades: [
      { 
        title: 'Student', 
        dataIndex: 'student', 
        key: 'studentName',
        render: (student) => {
          // Safely handle both string and object cases
          if (typeof student === 'string') return student;
          if (student && typeof student === 'object') return student.name || 'N/A';
          return 'N/A';
        }
      },
      { 
        title: 'Subject', 
        dataIndex: 'subject', 
        key: 'subjectName',
        render: (subject) => {
          // Safely handle both string and object cases
          if (typeof subject === 'string') return subject;
          if (subject && typeof subject === 'object') return subject.name || 'N/A';
          return 'N/A';
        }
      },
      { 
        title: 'Grade', 
        dataIndex: 'gradeLetter', 
        key: 'gradeLetter',
        render: (gradeLetter) => gradeLetter || 'N/A'
      },
      { 
        title: 'Score', 
        dataIndex: 'score', 
        key: 'score',
        render: (score) => score || 'N/A'
      },
      { 
        title: 'Term', 
        dataIndex: 'term', 
        key: 'term',
        render: (term) => {
          // Safely handle both string and object cases
          if (typeof term === 'string') return term;
          if (term && typeof term === 'object') return term.name || 'N/A'; // Fixed: was 'subject' instead of 'term'
          return 'N/A';
        }
      },
      {
        title: 'Status',
        key: 'status',
        render: (record) => (
          <Tag color={record.submitted ? 'green' : 'orange'}>
            {record.submitted ? 'Submitted' : 'Draft'}
          </Tag>
        ),
      },
    ],
    
    terms: [
      {
        title: 'Term Name',
        key: 'termName',
        render: (record) => record.name || 'N/A',
      },
      {
        title: 'Start Date',
        key: 'startDate',
        render: (record) => new Date(record.startDate).toLocaleDateString(),
      },
      {
        title: 'End Date',
        key: 'endDate',
        render: (record) => new Date(record.endDate).toLocaleDateString(),
      },
      {
        title: 'Status',
        key: 'status',
        render: (record) => {
          const now = new Date();
          const start = new Date(record.startDate);
          const end = new Date(record.endDate);
          const status = start <= now && now <= end ? 'isActive' : 'inactive';
          return <Tag color={status === 'isActive' ? 'green' : 'blue'}>{status}</Tag>;
        },
      },
    ]
  };

  const actionColumn = {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space size="small">
        {/* Only show edit/delete for attendance and grades */}
        {(selectedKey === '4' || selectedKey === '6') && (
          <>
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
          </>
        )}
        {/* View only for other sections */}
        {(selectedKey === '2' || selectedKey === '3' || selectedKey === '5' || selectedKey === '7') && (
          <Tooltip title="View">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
        )}
      </Space>
    ),
  };

  const keyMap = {
    '2': 'students',
    '3': 'classes',
    '4': 'attendance',
    '5': 'subjects',
    '6': 'grades',
    '7': 'terms'
  };

  return [...(baseColumns[keyMap[selectedKey]] || []), actionColumn];
};

  const getTableData = () => {
    const dataMap = {
      '2': students, // All students
     '3': classes?.filter(cls => {
      // Debug logging to see what's happening
      console.log('Class teacher:', cls.teacher);
      console.log('Current user:', user);
      
      // Handle different teacher data structures
      let teacherId;
      
      if (cls.teacher) {
        if (typeof cls.teacher === 'string') {
          teacherId = cls.teacher;
        } else if (typeof cls.teacher === 'object' && cls.teacher._id) {
          teacherId = cls.teacher._id;
        }
      }
      
      console.log('Extracted teacher ID:', teacherId);
      console.log('User ID:', user?.id); // Changed from _id to id
      console.log('Match:', teacherId === user?.id); // Changed from _id to id
      
      return teacherId === user?.id; // Changed from _id to id
    }),
      '4': attendance,
      '5': subjects,
      '6': grades,
      '7': terms
    };
    return dataMap[selectedKey] || [];
  };

  const getModalTitle = () => {
    const titles = {
      '2': 'Student',
      '3': 'Class',
      '4': 'Attendance',
      '5': 'Subject',
      '6': 'Grade',
      '7': 'Academic Term'
    };
    return `${editingRecord ? 'Edit' : 'Create'} ${titles[selectedKey]}`;
  };

  const renderFormFields = () => {
    switch(selectedKey) {
      case '4': // Attendance
        return (
          <>
            <Form.Item
        name="student"
        label="Student"
        rules={[{ required: true, message: 'Please select a student' }]}
      >
        <Select placeholder="Select a student">
          {students?.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name} ({s.roll_number})
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
          {classes?.filter(cls => {
            const teacherId = cls.teacher?._id || cls.teacher?.id;
            return teacherId === user?.id || teacherId === user?._id;
          })?.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

            <Form.Item
              name="attendanceDate"
              label="Attendance Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

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

            <Form.Item
              name="remarks"
              label="Remarks"
              rules={[{ required: false }]}
            >
              <TextArea rows={3} placeholder="Optional remarks" />
            </Form.Item>
          </>
        );

        case '6': // Grades
        return (
          <>
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
      
            <Form.Item
              name="score"
              label="Score"
              rules={[{ required: true, message: 'Please enter the score' }]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
      
            <Form.Item
              name="grade"
              label="Grade"
              rules={[{ required: true, message: 'Please enter the grade' }]}
            >
              <Select placeholder="Select grade">
                <Option value="A">A (90-100)</Option>
                <Option value="B">B (80-89)</Option>
                <Option value="C">C (70-79)</Option>
                <Option value="D">D (60-69)</Option>
                <Option value="F">F (Below 60)</Option>
              </Select>
            </Form.Item>
      
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
      
            <Form.Item
              name="year"
              label="Year"
            >
              <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
            </Form.Item>
      
            <Form.Item
              name="remarks"
              label="Remarks"
            >
              <TextArea rows={3} placeholder="Optional remarks" />
            </Form.Item>
          </>
        );
      default:
        return <div>View only mode</div>;
    }
  };

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
                
              case '3': // Classes
                if (column.key === 'className') {
                  displayValue = record.name || 'N/A';
                } else if (column.key === 'gradeLevel') {
                  displayValue = record.section || 'N/A';
                } else if (column.key === 'studentCount') {
                  displayValue = record.students?.length || 0;
                } else if (column.key === 'subject') {
                  displayValue = record.subject?.name || 'N/A';
                }
                break;
                
              case '4': // Attendance
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
                
              case '5': // Subjects
                if (column.key === 'subjectName') {
                  displayValue = record.name || 'N/A';
                } else if (column.key === 'subjectCode') {
                  displayValue = record._id ? record._id.slice(-6).toUpperCase() : 'N/A';
                } else if (column.key === 'gradeLevel') {
                  displayValue = record.class?.name || 'N/A';
                }
                break;
                
                case '6': // Grades
                if (column.key === 'studentName') {
                  const student = record.student;
                  displayValue = typeof student === 'string' ? student : 
                                (student && typeof student === 'object' ? student.name : 'N/A');
                } else if (column.key === 'subjectName') {
                  const subject = record.subject;
                  displayValue = typeof subject === 'string' ? subject : 
                                (subject && typeof subject === 'object' ? subject.name : 'N/A');
                } else if (column.key === 'gradeLetter') {
                  displayValue = record.gradeLetter || 'N/A';
                } else if (column.key === 'score') {
                  displayValue = record.score || 'N/A';
                } else if (column.key === 'term') {
                  const term = record.term;
                  displayValue = typeof term === 'string' ? term : 
                                (term && typeof term === 'object' ? term.name : 'N/A');
                } else if (column.key === 'status') {
                  value = <Tag color={record.submitted ? 'green' : 'orange'}>
                    {record.submitted ? 'Submitted' : 'Draft'}
                  </Tag>;
                }
                break;
                
              case '7': // Terms
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
                  const status = start <= now && now <= end ? 'active' : 'inactive';
                  value = <Tag color={status === 'active' ? 'green' : 'blue'}>{status}</Tag>;
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
            {/* Only show edit/delete for attendance and grades */}
            {(selectedKey === '4' || selectedKey === '6') && (
              <>
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
              </>
            )}
            {/* View only for other sections */}
            {(selectedKey === '2' || selectedKey === '3' || selectedKey === '5' || selectedKey === '7') && (
              <Tooltip title="View">
                <Button 
                  type="link" 
                  icon={<EyeOutlined />} 
                  onClick={() => openEditModal(record)}
                  size="small"
                />
              </Tooltip>
            )}
          </div>
        </div>
      );
    });
  };

  const renderContent = () => {
    if (selectedKey === '1') {
      return <TeacherDashboardOverview stats={stats} onBackToHome={handleBackToHome} />;
    }

    const tableColumns = getTableColumns();
    const tableData = getTableData();

    // Only show "Add New" button for sections where teacher can create
    const showAddButton = selectedKey === '4' || selectedKey === '6';

    return (
      <div style={{ padding: '24px' }}>
        <Card 
          title={menuItems.find(item => item.key === selectedKey)?.label + ' Management'}
          extra={
            showAddButton && (
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
                loading={studentsLoading || classesLoading || attendanceLoading}
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

        {/* Only show modal for sections where teacher can create/edit */}
        {(selectedKey === '4' || selectedKey === '6') && (
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
                Teacher Portal
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
              <Text style={{ color: 'white' }}>{user?.name || 'Teacher'}</Text>
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

const TeacherDashboardOverview = ({ stats, onBackToHome }) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  
  return (
    <div style={{ padding: screens.xs ? '16px' : '24px' }}>
      {/* Welcome Section */}
      <Card
       className='overview-card' 
        style={{ 
          marginBottom: '24px',
         
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Welcome back, Teacher! 👋
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: screens.xs ? '14px' : '16px', margin: '8px 0 0 0' }}>
              Manage your classes, track student progress, record attendance, and submit grades from your dashboard.
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
              title="My Classes"
              value={stats.myClasses}
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
              title="Today's Attendance"
              value={stats.todayAttendance}
              prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
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
              title="Pending Grades"
              value={stats.pendingGrades}
              prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
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
              title="Total Classes"
              value={stats.totalClasses}
              prefix={<TeamOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2', fontSize: screens.xs ? '28px' : '32px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;