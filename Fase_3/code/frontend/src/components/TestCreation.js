import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Typography, Col, Row, DatePicker, Space, Select, Switch, InputNumber } from 'antd';
import { UploadOutlined, RightOutlined, CheckOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '../components/TestCreation.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify"
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

const TestUpload = () => {
    const [phase, setPhase] = useState(0);
    const [testName, setTestName] = useState('');
    const [fileContent, setFileContent] = useState(null);
    const [date, setDate] = useState(null)
    const [duration, setDuration] = useState(null)
    const [admission, setAdmission] = useState(null)
    const [classrooms, setClassrooms] = useState([])
    const [versionsNumber, setVersionsNumber] = useState(4)
    const [randomness, setRandomness] = useState(true)
    const [goBack, setGoBack] = useState(true)
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [testVersions, setTestVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [questionsByVersion, setQuestionsByVersion] = useState({});

    const [options, setOptions] = useState([])

    var testId = 0

    const onFinish = async (values) => {
        if (phase == 0) {
            console.log(fileContent)
            try {
                const response = await axios.post(`http://localhost:3003/users/validate?secret_token=${localStorage.token}`, {
                    students: fileContent
                });

                if (response.data.successful === true) {
                    setPhase(1)
                }
                // Handle successful login (e.g., redirect, store token)
            } catch (error) {
                toast.info("Os alunos introduzidos são inválidos!", {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        }
        else if (phase == 1) {        
            const date = new Date(Date.now()).toISOString()

            var temp = []
            for (let i = 0; i < classrooms.length; i++) {
                temp.push({
                    _id: classrooms[i],
                    startDate: date
                })
            }

            axios.post(`http://localhost:3003/tests?secret_token=${localStorage.token}`, {
                classrooms: temp,
                duration: duration,
                name: testName,
                students: fileContent,
                admission: admission
            });

            if (classrooms.length != 0) {
                setPhase(2)
            }
        }
        else if(phase == 2){
            setPhase(3)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const beforeUpload = (file) => {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                setFileContent(json);
            } catch (err) {
            }
        };

        fileReader.readAsText(file);

        // Prevent upload since we are handling it manually
        return false;
    };

    const onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };

    const onOk = async (value) => {
        setDate(value.format("YYYY-MM-DDTHH:mm:ss"))

        if (duration != null) {
            try {
                const response = await axios.get(`http://localhost:3003/classrooms/${value.format("YYYY-MM-DDTHH:mm:ss")}/${duration}?secret_token=${localStorage.token}`);

                console.log(response.data)
                var data = response.data
                var temp = []
                for (let i = 0; i < data.length; i++) {
                    temp.push({
                        label: `Edifício: ${data[i].building} | Piso: ${data[i].floor} | Capacidade: ${data[i].capacity} `,
                        value: data[i]._id
                    })
                }

                setOptions(temp)
                console.log(temp)

                // Handle successful login (e.g., redirect, store token)
            } catch (error) {
                toast.info("Não foi possível obter as salas!", {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        }
    };

    const handleDurationChange = async (value) => {
        setDuration(value)

        if (date != null) {
            try {
                const response = await axios.get(`http://localhost:3003/classrooms/${value.format("YYYY-MM-DDTHH:mm:ss")}/${duration}?secret_token=${localStorage.token}`);

                console.log(response.data)
                var data = response.data
                var temp = []
                for (let i = 0; i < data.length; i++) {
                    temp.push({
                        label: `Edifício: ${data[i].building} | Piso: ${data[i].floor} | Capacidade: ${data[i].capacity} `,
                        value: data[i]._id
                    })
                }

                setOptions(temp)
                console.log(temp)

                // Handle successful login (e.g., redirect, store token)
            } catch (error) {
                toast.info("Não foi possível obter as salas!", {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        }
    };

    const handleAdmissionChange = (value) => {
        setAdmission(value)
    };

    const handleMultipleSelectChange = (value) => {
        setClassrooms(value)
    }

    const handleVersionsNumberChange = (value) => {
        var temp = []
        for(let i = 1; i <= value; i++){
            temp.push(i)
        }
        setTestVersions(temp)
        setVersionsNumber(value)
    }

    const onRandomnessChange = (checked) => {
        setRandomness(checked)
    };

    const onGoBackChange = (checked) => {
        setGoBack(checked)
    };

    const handleFinishTest = () => {
        axios.put(`http://localhost:3003/tests/version?secret_token=${localStorage.token}`, {
            test_id:testId,
            _id:0,
            question: questionsByVersion
        });
    };

    // Função para gerar opções de versão
    const generateVersionOptions = () => {
        let options = [];
        for (let i = 1; i <= versionsNumber; i++) {
            options.push(<Option key={i} value={i}>{i}</Option>);
        }
        return options;
    };

    useEffect(() => {
        form.setFieldsValue({ questions: questionsByVersion[selectedVersion] });
    }, [selectedVersion, questionsByVersion, form]);

    const onVersionChange = (value) => {
        setSelectedVersion(value);
    };

    const onVersionsSubmit = (values) => {
        console.log(values)
        setQuestionsByVersion({ ...questionsByVersion, [selectedVersion]: values.questions });
    };


    return (
        <>
            <ToastContainer />
            <Row justify="space-around" align="middle">
                <Col xs={20} sm={16} md={12} lg={8} xl={4}>
                    {
                        phase == 0 ?
                            <Form
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                                layout="vertical"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Title level={2} align="middle">Criar Teste</Title>
                                <Form.Item
                                    label="Nome do Teste"
                                    name="testName"
                                    rules={[{ required: true, message: 'Insira o nome da prova' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Alunos a inscrever"
                                    name="testFile"
                                    rules={[{ required: true, message: 'Insira a lista de alunos' }]}
                                    valuePropName="fileList"
                                    getValueFromEvent={({ fileList }) => fileList}
                                >
                                    <Upload
                                        beforeUpload={beforeUpload} // Prevent automatic upload
                                        accept=".json"
                                    >
                                        <Button icon={<UploadOutlined />}>Carregar Lista de Alunos</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit" icon={<RightOutlined />}>
                                        Seguinte
                                    </Button>
                                </Form.Item>
                            </Form>
                            :
                            <>
                                {
                                    phase == 1
                                        ?
                                        <Form
                                            name="basic"
                                            initialValues={{
                                                remember: true,
                                            }}
                                            layout="vertical"
                                            onFinish={onFinish}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                        >
                                            <Title level={2} align="middle">Criar Teste</Title>
                                            <Form.Item
                                                label="Data Inicial"
                                                name="date"
                                            >
                                                <Space direction="vertical" size={12}>
                                                    <DatePicker showTime onChange={onChange} onOk={onOk} />
                                                </Space>
                                            </Form.Item>

                                            <Form.Item
                                                label="Duração"
                                                rules={[{ required: true, message: 'Insira a duração da prova' }]}
                                            >
                                                <Select onChange={handleDurationChange}>
                                                    <Select.Option value="30">30 minutos</Select.Option>
                                                    <Select.Option value="60">60 minutos</Select.Option>
                                                    <Select.Option value="90">90 minutos</Select.Option>
                                                    <Select.Option value="120">120 minutos</Select.Option>
                                                    <Select.Option value="150">150 minutos</Select.Option>
                                                    <Select.Option value="180">180 minutos</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Admissão"
                                                rules={[{ required: true, message: 'Insira a admissão da prova' }]}
                                            >
                                                <Select onChange={handleAdmissionChange}>
                                                    <Select.Option value="30">5 minutos</Select.Option>
                                                    <Select.Option value="60">10 minutos</Select.Option>
                                                    <Select.Option value="90">15 minutos</Select.Option>
                                                    <Select.Option value="120">20 minutos</Select.Option>
                                                    <Select.Option value="150">25 minutos</Select.Option>
                                                    <Select.Option value="180">30 minutos</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Datas"
                                                rules={[{ required: true, message: 'Insira as datas da prova' }]}
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Por favor selecione as datas"
                                                    onChange={handleMultipleSelectChange}
                                                    options={options}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                wrapperCol={{
                                                    offset: 8,
                                                    span: 16,
                                                }}
                                            >
                                                <Button type="primary" htmlType="submit" icon={<RightOutlined />}>
                                                    Seguinte
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        :
                                        <>
                                            {
                                                phase == 2 ?
                                                    <Form
                                                        name="basic"
                                                        initialValues={{
                                                            remember: true,
                                                        }}
                                                        layout="vertical"
                                                        onFinish={onFinish}
                                                        onFinishFailed={onFinishFailed}
                                                        autoComplete="off"
                                                    >
                                                        <Title level={2} align="middle">Criar Teste</Title>
                                                        <Form.Item
                                                            label="Número de versões"
                                                            name="date"
                                                            rules={[{ required: true, message: 'Selecione o número de versões' }]}
                                                        >
                                                            <Select onChange={handleVersionsNumberChange}>
                                                                <Select.Option value="1">1</Select.Option>
                                                                <Select.Option value="2">2</Select.Option>
                                                                <Select.Option value="3">3</Select.Option>
                                                                <Select.Option value="4">4</Select.Option>
                                                                <Select.Option value="5">5</Select.Option>
                                                                <Select.Option value="6">6</Select.Option>
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Aleatoriedade das perguntas"
                                                        >
                                                            <Switch
                                                                checkedChildren={<CheckOutlined />}
                                                                unCheckedChildren={<CloseOutlined />}
                                                                defaultChecked
                                                                onChange={onRandomnessChange}
                                                            />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Voltar atrás nas perguntas"
                                                        >
                                                            <Switch
                                                                checkedChildren={<CheckOutlined />}
                                                                unCheckedChildren={<CloseOutlined />}
                                                                defaultChecked
                                                                onChange={onGoBackChange}
                                                            />
                                                        </Form.Item>

                                                        {classrooms.map((room, index) => (
                                                            <Form.Item
                                                                key={room}
                                                                name={`version_${index}`}
                                                                label={room}
                                                                rules={[{ required: true, message: 'Número da versão é necessário' }]}
                                                            >
                                                                <Select placeholder="Selecione a versão">
                                                                    {generateVersionOptions()}
                                                                </Select>
                                                            </Form.Item>
                                                        ))}

                                                        <Form.Item
                                                            wrapperCol={{
                                                                offset: 8,
                                                                span: 16,
                                                            }}
                                                        >
                                                            <Button type="primary" htmlType="submit" icon={<RightOutlined />}>
                                                                Seguinte
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>
                                                    :
                                                    <div>
                                                        <Select
                                                            style={{ width: '100%', marginBottom: 16 }}
                                                            placeholder="Selecione uma versão do teste"
                                                            onChange={onVersionChange}
                                                            value={selectedVersion}
                                                        >
                                                            {testVersions.map(version => (
                                                                <Option key={version} value={version}>{"Versão " + version}</Option>
                                                            ))}
                                                        </Select>

                                                        {selectedVersion != null && (
                                                            <Form form={form} onFinish={onVersionsSubmit}>
                                                                <Form.List name="questions">
                                                                    {(fields, { add, remove }) => (
                                                                        <>
                                                                            {fields.map(field => (
                                                                                <div key={field.key}>
                                                                                    <Space align="center" style={{ display: 'flex', width: '100%', marginBottom: 8 }}>
                                                                                        <Form.Item
                                                                                            name={[field.name, 'type']}
                                                                                            fieldKey={[field.fieldKey, 'type']}
                                                                                            rules={[{ required: true, message: 'Tipo é obrigatório' }]}
                                                                                            style={{ flex: 1 }}
                                                                                        >
                                                                                            <Select placeholder="Tipo de Pergunta" style={{ width: '100%' }}>
                                                                                                <Option value="2">Desenvolvimento</Option>
                                                                                                <Option value="1">Escolha Múltipla</Option>
                                                                                            </Select>
                                                                                        </Form.Item>
                                                                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                                                    </Space>
                                                                                    <Form.Item
                                                                                        name={[field.name, 'description']}
                                                                                        fieldKey={[field.fieldKey, 'description']}
                                                                                        rules={[{ required: true, message: 'Pergunta é obrigatória' }]}
                                                                                    >
                                                                                        <Input placeholder="Digite sua pergunta aqui" />
                                                                                    </Form.Item>
                                                                                    <Form.Item
                                                                                        name={[field.name, 'grade']}
                                                                                        fieldKey={[field.fieldKey, 'grade']}
                                                                                        rules={[{ required: true, message: 'Pontuação é obrigatória' }]}
                                                                                    >
                                                                                        <InputNumber placeholder="Pontuação" min={0} style={{ width: '100%' }} />
                                                                                    </Form.Item>
                                                                                    {form.getFieldValue(['questions', field.name, 'type']) === '1' && (
                                                                                        <Form.List name={[field.name, 'options']}>
                                                                                            {(optionsFields, { add: addOption, remove: removeOption }) => (
                                                                                                <>
                                                                                                    {optionsFields.map((optionField, index) => (
                                                                                                        <Space key={optionField.key} align="baseline" style={{ display: 'flex', width: '100%', marginBottom: 8 }}>
                                                                                                            <Form.Item
                                                                                                                name={[optionField.name, 'option']}
                                                                                                                fieldKey={[optionField.fieldKey, 'option']}
                                                                                                                rules={[{ required: true, message: 'Opção é obrigatória' }]}
                                                                                                                style={{ flex: 1 }}
                                                                                                            >
                                                                                                                <Input placeholder={`Opção ${index + 1}`} />
                                                                                                            </Form.Item>
                                                                                                            <Form.Item
                                                                                                                name={[optionField.name, 'grade']}
                                                                                                                fieldKey={[optionField.fieldKey, 'grade']}
                                                                                                                rules={[{ required: true, message: 'Pontuação da opção é obrigatória' }]}
                                                                                                            >
                                                                                                                <InputNumber placeholder="Pontuação" min={0} />
                                                                                                            </Form.Item>
                                                                                                            <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                                                                                                        </Space>
                                                                                                    ))}
                                                                                                    <Button type="dashed" onClick={() => addOption()} icon={<PlusOutlined />} style={{ width: '100%' }}>
                                                                                                        Adicionar Opção
                                                                                                    </Button>
                                                                                                </>
                                                                                            )}
                                                                                        </Form.List>
                                                                                    )}
                                                                                    <hr style={{ margin: '16px 0' }} />
                                                                                </div>
                                                                            ))}
                                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                                Adicionar Pergunta
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </Form.List>
                                                                <Form.Item style={{ marginTop: 24 }}>
                                                                    <Button type="primary" htmlType="submit">
                                                                        Salvar Perguntas
                                                                    </Button>

                                                                    <Button type="primary" htmlType="submit" onClick={handleFinishTest}>
                                                                        Concluir
                                                                    </Button>
                                                                </Form.Item>
                                                            </Form>
                                                        )}
                                                    </div>
                                            }
                                        </>
                                }
                            </>
                    }
                </Col>
            </Row>
        </>
    );
};

export default TestUpload;
