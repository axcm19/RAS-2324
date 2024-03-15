import React, { useState, useEffect  } from 'react';
import { Form, Input, Button, List, Modal, InputNumber, DatePicker } from 'antd';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useLocation  } from 'react-router-dom';

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const token = location.state?.token;

  useEffect(() => {
    criaLista();
  }, []);
  
  const criaLista = async () => {
    try {
      
      const response = await axios.get(`http://localhost:3003/classrooms`);
      console.log('Received values of form: ', response);  
      setClassrooms(response.data);
      }
     catch (error) {
      toast.info("Os dados introduzidos são inválidos!", {
        position: toast.POSITION.TOP_CENTER
      });
      
        
      

      

    }
  };


  const onAdd = async (classroom) => {
    try {
      console.log('Received values of form: ', classroom);
      const response = await axios.post(`http://localhost:3003/classrooms?secret_token=${token}`, {
        floor: classroom.sala,
        building: classroom.edificio,
        capacity: classroom.capacidade
      });

      console.log(response.data);
      //setClassrooms([...classrooms, classroom]);
      criaLista();
      form.resetFields();
      toast.success("Classroom added successfully", {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (error) {
      toast.info("Os dados introduzidos são inválidos!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const removeClassroom = async (index) => {

    try {
      const response = await axios.delete(`http://localhost:3003/classrooms/${classrooms[index]._id}?secret_token=${token}`);
      console.log(response.data);
      //setClassrooms(classrooms.filter((item, i) => i !== index));
      criaLista();
      toast.success("Classroom removed successfully", {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (error) {
      toast.info("Os dados introduzidos são inválidos!", {
        position: toast.POSITION.TOP_CENTER
      });
    }

  
  };

  return (
    <div>
      <Form form={form} onFinish={onAdd} layout="vertical">
        <Form.Item name="sala" label="Sala" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="edificio" label="Edificio" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="capacidade" label="Capacidade" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Adicionar Sala
        </Button>
      </Form>
      <List
        dataSource={classrooms}
        renderItem={(item, index) => (
          <List.Item
            actions={[<Button onClick={() => removeClassroom(index)}>Remover</Button>]}
          >
            {`Sala: ${item.floor}, Edificio: ${item.building}, Capacidade: ${item.capacity}`}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ClassroomPage;
