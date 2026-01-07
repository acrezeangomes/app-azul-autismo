'use client'

import Link from 'next/link'
import { 
  Heart, 
  Calendar, 
  FileText, 
  Pill, 
  Shield, 
  Users,
  Clock,
  Bell,
  Plus,
  User as UserIcon,
  LogIn,
  UserPlus,
  Archive,
  Edit,
  ArchiveRestore
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

// Dados fictícios para demonstração
const demoChildren = [
  { id: '1', name: 'Maria Silva', birth_date: '2018-05-15', age: '5 anos' },
  { id: '2', name: 'João Silva', birth_date: '2020-08-22', age: '3 anos' },
]

const demoMedications = [
  {
    id: '1',
    name: 'Risperidona',
    dosage: '1mg',
    frequency: '2x ao dia',
    times: ['08:00', '20:00'],
    notes: 'Tomar com alimentos',
    active: true
  },
  {
    id: '2',
    name: 'Vitamina D',
    dosage: '400 UI',
    frequency: '1x ao dia',
    times: ['09:00'],
    notes: 'Após o café da manhã',
    active: true
  }
]

const demoDocuments = [
  {
    id: '1',
    type: 'receita',
    title: 'Receita Risperidona',
    date: '2024-01-15',
    notes: 'Válida por 6 meses'
  },
  {
    id: '2',
    type: 'exame',
    title: 'Hemograma Completo',
    date: '2024-01-10',
    notes: 'Resultado dentro da normalidade'
  },
  {
    id: '3',
    type: 'resultado',
    title: 'Avaliação Neurológica',
    date: '2024-01-05',
    notes: 'Acompanhamento trimestral recomendado'
  }
]

const initialAppointments = [
  {
    id: '1',
    type: 'Consulta',
    title: 'Consulta com Neurologista',
    date: '2024-02-15',
    time: '14:30',
    location: 'Clínica São Lucas',
    notes: 'Levar exames anteriores',
    archived: false
  },
  {
    id: '2',
    type: 'Exame',
    title: 'Exame de Sangue',
    date: '2024-02-20',
    time: '08:00',
    location: 'Laboratório Central',
    notes: 'Jejum de 8 horas',
    archived: false
  },
  {
    id: '3',
    type: 'Consulta',
    title: 'Consulta com Pediatra',
    date: '2024-01-10',
    time: '10:00',
    location: 'Clínica Infantil',
    notes: 'Consulta de rotina realizada',
    archived: true
  },
  {
    id: '4',
    type: 'Exame',
    title: 'Raio-X de Tórax',
    date: '2024-01-05',
    time: '15:00',
    location: 'Hospital Central',
    notes: 'Exame realizado com sucesso',
    archived: true
  }
]

export default function Home() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ date: '', time: '' })

  const handleArchive = (id: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, archived: true } : app
      )
    )
  }

  const handleUnarchive = (id: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, archived: false } : app
      )
    )
  }

  const handleEdit = (id: string, date: string, time: string) => {
    setEditingId(id)
    setEditForm({ date, time })
  }

  const handleSaveEdit = (id: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, date: editForm.date, time: editForm.time } : app
      )
    )
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ date: '', time: '' })
  }

  const activeAppointments = appointments.filter(app => !app.archived)
  const archivedAppointments = appointments.filter(app => app.archived)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header com botões de ação */}
      <header className="bg-white shadow-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">AzulCare</h1>
                <p className="text-sm text-blue-600">Cuidado organizado</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link href="/login?mode=signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de demonstração */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold">Demonstração Interativa</h2>
          </div>
          <p className="text-blue-100">
            Esta é uma prévia do que você pode fazer após criar sua conta. Todos os dados abaixo são fictícios para demonstração.
          </p>
        </div>

        {/* Seleção de crianças (demo) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Crianças Cadastradas</h2>
            <Badge className="bg-blue-600 text-white">Exemplo</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {demoChildren.map((child, index) => (
              <Card
                key={child.id}
                className={`transition-all ${
                  index === 0
                    ? 'ring-2 ring-blue-600 bg-blue-50'
                    : 'opacity-75'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{child.name}</h3>
                      <p className="text-sm text-gray-600">{child.age}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs com dados fictícios */}
        <Tabs defaultValue="medications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="medications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Pill className="w-4 h-4 mr-2" />
              Medicações
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </TabsTrigger>
          </TabsList>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Medicações de Maria Silva
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Nova Medicação
              </Button>
            </div>

            <div className="grid gap-4">
              {demoMedications.map((med) => (
                <Card key={med.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-blue-900">{med.name}</CardTitle>
                        <CardDescription>{med.dosage} - {med.frequency}</CardDescription>
                      </div>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Horários:</span>
                        {med.times.map((time, idx) => (
                          <Badge key={idx} variant="outline" className="border-blue-300 text-blue-700">
                            {time}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{med.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Documentos de Maria Silva
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Button>
            </div>

            <div className="grid gap-4">
              {demoDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-blue-900">{doc.title}</CardTitle>
                        <CardDescription>
                          {new Date(doc.date).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-600">
                        {doc.type === 'receita' ? 'Receita' : doc.type === 'exame' ? 'Exame' : 'Resultado'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{doc.notes}</p>
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50" disabled>
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Documento
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Agenda de Maria Silva
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </div>

            {/* Consultas/Exames Ativos */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Próximas Consultas e Exames
              </h4>
              <div className="grid gap-4">
                {activeAppointments.map((app) => (
                  <Card key={app.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-blue-900">{app.title}</CardTitle>
                          <CardDescription>{app.type}</CardDescription>
                        </div>
                        <Badge className="bg-blue-600">
                          <Bell className="w-3 h-3 mr-1" />
                          Lembrete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingId === app.id ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="time"
                              value={editForm.time}
                              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSaveEdit(app.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Salvar
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              variant="outline"
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>{new Date(app.date).toLocaleDateString('pt-BR')}</span>
                              <Clock className="w-4 h-4 text-blue-600 ml-2" />
                              <span>{app.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">📍 {app.location}</p>
                            <p className="text-sm text-gray-600 mt-2">{app.notes}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(app.id, app.date, app.time)}
                              variant="outline"
                              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              onClick={() => handleArchive(app.id)}
                              variant="outline"
                              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Arquivar
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Consultas/Exames Arquivados */}
            {archivedAppointments.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Archive className="w-5 h-5 text-gray-600" />
                  Histórico Arquivado
                </h4>
                <div className="grid gap-4">
                  {archivedAppointments.map((app) => (
                    <Card key={app.id} className="hover:shadow-lg transition-shadow bg-gray-50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-gray-700">{app.title}</CardTitle>
                            <CardDescription>{app.type}</CardDescription>
                          </div>
                          <Badge className="bg-gray-500">
                            <Archive className="w-3 h-3 mr-1" />
                            Arquivado
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(app.date).toLocaleDateString('pt-BR')}</span>
                            <Clock className="w-4 h-4 text-gray-500 ml-2" />
                            <span>{app.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">📍 {app.location}</p>
                          <p className="text-sm text-gray-600 mt-2">{app.notes}</p>
                        </div>
                        <Button
                          onClick={() => handleUnarchive(app.id)}
                          variant="outline"
                          className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Desarquivar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Final */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuitamente e comece a organizar a saúde da sua família hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login?mode=signup">
              <Button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                <LogIn className="w-5 h-5 mr-2" />
                Já Tenho Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
