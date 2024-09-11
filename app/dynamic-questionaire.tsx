"use client"
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const DynamicQuestionnaire = () => {
  const [step, setStep] = useState('create');
  const [questions, setQuestions] = useState([]);
  const [creatorAnswers, setCreatorAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [newQuestion, setNewQuestion] = useState('');
  const [uniqueUrl, setUniqueUrl] = useState('');

  const addQuestion = () => {
    if (newQuestion.trim() !== '') {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const generateUniqueUrl = () => {
    // In a real app, this would be generated on the server
    const random = Math.random().toString(36).substring(2, 15);
    setUniqueUrl(`https://yourapp.com/questionnaire/${random}`);
    setStep('creatorAnswer');
  };

  const handleCreatorAnswerChange = (question, value) => {
    setCreatorAnswers(prev => ({ ...prev, [question]: parseInt(value) }));
  };

  const handleUserAnswerChange = (question, value) => {
    setUserAnswers(prev => ({ ...prev, [question]: parseInt(value) }));
  };

  const submitCreatorAnswers = () => {
    // In a real app, you'd save these to your backend
    setStep('userAnswer');
  };

  const submitUserAnswers = () => {
    // In a real app, you'd save these to your backend
    setStep('results');
  };

  const renderCreateQuestions = () => (
    <Card className="w-full mx-auto">
      <CardHeader>Create Questions</CardHeader>
      <CardContent>
        <Textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter a new question"
          className="mb-2"
        />
        <Button onClick={addQuestion} className="mb-4">Add Question</Button>
        <ul className="mb-4">
          {questions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
        <Button onClick={generateUniqueUrl} disabled={questions.length === 0}>
          Generate Unique URL
        </Button>
      </CardContent>
    </Card>
  );

  const renderAnswerForm = (answers, onChange, onSubmit, title) => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>{title}</CardHeader>
      <CardContent>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">{question}</label>
            <Input
              type="number"
              min="1"
              max="5"
              onChange={(e) => onChange(question, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
        <Button onClick={onSubmit} className="w-full">Submit</Button>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const chartData = questions.map(question => ({
      question: question.substring(0, 20) + '...', // Truncate for display
      creatorScore: creatorAnswers[question] || 0,
      userScore: userAnswers[question] || 0,
    }));

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>Results Comparison</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="creatorScore" fill="#8884d8" name="Creator" />
              <Bar dataKey="userScore" fill="#82ca9d" name="User" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  switch (step) {
    case 'create':
      return renderCreateQuestions();
    case 'creatorAnswer':
      return renderAnswerForm(creatorAnswers, handleCreatorAnswerChange, submitCreatorAnswers, "Creator: Answer Your Questions");
    case 'userAnswer':
      return (
        <>
          <p className="text-center mb-4">Share this URL with others: {uniqueUrl}</p>
          {renderAnswerForm(userAnswers, handleUserAnswerChange, submitUserAnswers, "User: Answer the Questions")}
        </>
      );
    case 'results':
      return renderResults();
    default:
      return null;
  }
};

export default DynamicQuestionnaire;