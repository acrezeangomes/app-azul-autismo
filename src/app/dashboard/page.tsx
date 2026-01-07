'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Heart, 
  Plus, 
  Calendar, 
  Pill, 
  FileText, 
  LogOut,
  User as UserIcon,
  Bell,
  Clock,
  Upload,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

type Child = {
  id: string
  name: string
  birth_date: string
  photo_url: string | null
  notes: string | null
}

type Medication = {
  id: string
  child_id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  notes: string | null
  active: boolean
}

type Document = {
  id: string
  child_id: string
  type: 'receita' | 'exame' | 'resultado'
  title: string
  file_url: string
  date: string
  notes: string | null
}

type Appointment = {
  id: string
  child_id: string
  type: string
  title: string
  date: string
  time: string
  location: string | null
  notes: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const configured = isSupabaseConfigured()

  // Dialogs state
  const [addChildOpen, setAddChildOpen] = useState(false)
  const [addMedOpen, setAddMedOpen] = useState(false)
  const [addDocOpen, setAddDocOpen] = useState(false)
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false)

  // Form states
  const [childName, setChildName] = useState('')
  const [childBirthDate, setChildBirthDate] = useState('')
  const [childNotes, setChildNotes] = useState('')

  const [medName, setMedName] = useState('')
  const [medDosage, setMedDosage] = useState('')
  const [medFrequency, setMedFrequency] = useState('')
  const [medTimes, setMedTimes] = useState('')
  const [medNotes, setMedNotes] = useState('')

  const [docType, setDocType] = useState<'receita' | 'exame' | 'resultado'>('receita')
  const [docTitle, setDocTitle] = useState('')
  const [docDate, setDocDate] = useState('')
  const [docNotes, setDocNotes] = useState('')

  const [appointmentType, setAppointmentType] = useState('')
  const [appointmentTitle, setAppointmentTitle] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [appointmentLocation, setAppointmentLocation] = useState('')
  const [appointmentNotes, setAppointmentNotes] = useState('')

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false)
      router.push('/login')
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        loadChildren(session.user.id)
      } else {
        router.push('/login')
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, configured])

  const loadChildren = async (userId: string) => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar crianças:', error)
      return
    }

    setChildren(data || [])
    if (data && data.length > 0) {
      setSelectedChild(data[0])
      loadChildData(data[0].id)
    }
  }

  const loadChildData = async (childId: string) => {
    if (!supabase) return

    // Load medications
    const { data: medsData } = await supabase
      .from('medications')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
    
    setMedications(medsData || [])

    // Load documents
    const { data: docsData } = await supabase
      .from('documents')
      .select('*')
      .eq('child_id', childId)
      .order('date', { ascending: false })
    
    setDocuments(docsData || [])

    // Load appointments
    const { data: appsData } = await supabase
      .from('appointments')
      .select('*')
      .eq('child_id', childId)
      .order('date', { ascending: true })
    
    setAppointments(appsData || [])
  }

  const handleAddChild = async () => {
    if (!user || !childName || !supabase) return

    const { data, error } = await supabase
      .from('children')
      .insert({
        user_id: user.id,
        name: childName,
        birth_date: childBirthDate,
        notes: childNotes,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao adicionar criança')
      return
    }

    toast.success('Criança adicionada com sucesso!')
    setChildren([data, ...children])
    setSelectedChild(data)
    setAddChildOpen(false)
    setChildName('')
    setChildBirthDate('')
    setChildNotes('')
  }

  const handleAddMedication = async () => {
    if (!selectedChild || !medName || !supabase) return

    const timesArray = medTimes.split(',').map(t => t.trim())

    const { data, error } = await supabase
      .from('medications')
      .insert({
        child_id: selectedChild.id,
        name: medName,
        dosage: medDosage,
        frequency: medFrequency,
        times: timesArray,
        notes: medNotes,
        active: true,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao adicionar medicação')
      return
    }

    toast.success('Medicação adicionada com sucesso!')
    setMedications([data, ...medications])
    setAddMedOpen(false)
    setMedName('')
    setMedDosage('')
    setMedFrequency('')
    setMedTimes('')
    setMedNotes('')
  }

  const handleAddDocument = async () => {
    if (!selectedChild || !docTitle || !supabase) return

    // Simulação de upload - em produção, usar Supabase Storage
    const { data, error } = await supabase
      .from('documents')
      .insert({
        child_id: selectedChild.id,
        type: docType,
        title: docTitle,
        file_url: 'https://placeholder.com/document.pdf',
        date: docDate,
        notes: docNotes,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao adicionar documento')
      return
    }

    toast.success('Documento adicionado com sucesso!')
    setDocuments([data, ...documents])
    setAddDocOpen(false)
    setDocTitle('')
    setDocDate('')
    setDocNotes('')
  }

  const handleAddAppointment = async () => {
    if (!selectedChild || !appointmentTitle || !supabase) return

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        child_id: selectedChild.id,
        type: appointmentType,
        title: appointmentTitle,
        date: appointmentDate,
        time: appointmentTime,
        location: appointmentLocation,
        notes: appointmentNotes,
        reminder_sent: false,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao adicionar consulta')
      return
    }

    toast.success('Consulta adicionada com sucesso!')
    setAppointments([...appointments, data])
    setAddAppointmentOpen(false)
    setAppointmentType('')
    setAppointmentTitle('')
    setAppointmentDate('')
    setAppointmentTime('')
    setAppointmentLocation('')
    setAppointmentNotes('')
  }

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!configured || !supabase) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Configuração Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-orange-300 bg-orange-50">
              <AlertDescription className="text-orange-700">
                Para usar o dashboard, conecte sua conta Supabase em{' '}
                <strong>Configurações do Projeto → Integrações → Conectar Supabase</strong>
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push('/login')}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Voltar para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">AzulCare</h1>
                <p className="text-sm text-blue-600">Cuidado organizado</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Children Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Crianças</h2>
            <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Criança
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Criança</DialogTitle>
                  <DialogDescription>
                    Cadastre as informações da criança
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="childName">Nome</Label>
                    <Input
                      id="childName"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Nome da criança"
                    />
                  </div>
                  <div>
                    <Label htmlFor="childBirthDate">Data de Nascimento</Label>
                    <Input
                      id="childBirthDate"
                      type="date"
                      value={childBirthDate}
                      onChange={(e) => setChildBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="childNotes">Observações</Label>
                    <Textarea
                      id="childNotes"
                      value={childNotes}
                      onChange={(e) => setChildNotes(e.target.value)}
                      placeholder="Informações adicionais..."
                    />
                  </div>
                  <Button onClick={handleAddChild} className="w-full bg-blue-600 hover:bg-blue-700">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {children.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedChild?.id === child.id
                    ? 'ring-2 ring-blue-600 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedChild(child)
                  loadChildData(child.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{child.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(child.birth_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {selectedChild && (
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
                  Medicações de {selectedChild.name}
                </h3>
                <Dialog open={addMedOpen} onOpenChange={setAddMedOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Medicação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Medicação</DialogTitle>
                      <DialogDescription>
                        Configure os horários e doses
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="medName">Nome do Medicamento</Label>
                        <Input
                          id="medName"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          placeholder="Ex: Risperidona"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medDosage">Dosagem</Label>
                        <Input
                          id="medDosage"
                          value={medDosage}
                          onChange={(e) => setMedDosage(e.target.value)}
                          placeholder="Ex: 1mg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medFrequency">Frequência</Label>
                        <Input
                          id="medFrequency"
                          value={medFrequency}
                          onChange={(e) => setMedFrequency(e.target.value)}
                          placeholder="Ex: 2x ao dia"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medTimes">Horários (separados por vírgula)</Label>
                        <Input
                          id="medTimes"
                          value={medTimes}
                          onChange={(e) => setMedTimes(e.target.value)}
                          placeholder="Ex: 08:00, 20:00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medNotes">Observações</Label>
                        <Textarea
                          id="medNotes"
                          value={medNotes}
                          onChange={(e) => setMedNotes(e.target.value)}
                          placeholder="Informações adicionais..."
                        />
                      </div>
                      <Button onClick={handleAddMedication} className="w-full bg-blue-600 hover:bg-blue-700">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {medications.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma medicação cadastrada</p>
                    </CardContent>
                  </Card>
                ) : (
                  medications.map((med) => (
                    <Card key={med.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-blue-900">{med.name}</CardTitle>
                            <CardDescription>{med.dosage} - {med.frequency}</CardDescription>
                          </div>
                          <Badge className={med.active ? 'bg-green-500' : 'bg-gray-400'}>
                            {med.active ? 'Ativo' : 'Inativo'}
                          </Badge>
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
                          {med.notes && (
                            <p className="text-sm text-gray-600 mt-2">{med.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Documentos de {selectedChild.name}
                </h3>
                <Dialog open={addDocOpen} onOpenChange={setAddDocOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Novo Documento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Documento</DialogTitle>
                      <DialogDescription>
                        Faça upload de receitas, exames ou resultados
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="docType">Tipo de Documento</Label>
                        <select
                          id="docType"
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="receita">Receita</option>
                          <option value="exame">Pedido de Exame</option>
                          <option value="resultado">Resultado de Exame</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="docTitle">Título</Label>
                        <Input
                          id="docTitle"
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          placeholder="Ex: Receita Risperidona"
                        />
                      </div>
                      <div>
                        <Label htmlFor="docDate">Data</Label>
                        <Input
                          id="docDate"
                          type="date"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="docFile">Arquivo (simulado)</Label>
                        <Input
                          id="docFile"
                          type="file"
                          accept="image/*,.pdf"
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Em produção, conecte ao Supabase Storage
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="docNotes">Observações</Label>
                        <Textarea
                          id="docNotes"
                          value={docNotes}
                          onChange={(e) => setDocNotes(e.target.value)}
                          placeholder="Informações adicionais..."
                        />
                      </div>
                      <Button onClick={handleAddDocument} className="w-full bg-blue-600 hover:bg-blue-700">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {documents.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum documento cadastrado</p>
                    </CardContent>
                  </Card>
                ) : (
                  documents.map((doc) => (
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
                        {doc.notes && (
                          <p className="text-sm text-gray-600">{doc.notes}</p>
                        )}
                        <Button variant="outline" className="mt-4 w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Documento
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Agenda de {selectedChild.name}
                </h3>
                <Dialog open={addAppointmentOpen} onOpenChange={setAddAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Consulta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agendar Consulta/Exame</DialogTitle>
                      <DialogDescription>
                        Configure lembretes automáticos
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="appointmentType">Tipo</Label>
                        <Input
                          id="appointmentType"
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          placeholder="Ex: Consulta, Exame de Sangue"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointmentTitle">Título</Label>
                        <Input
                          id="appointmentTitle"
                          value={appointmentTitle}
                          onChange={(e) => setAppointmentTitle(e.target.value)}
                          placeholder="Ex: Consulta com Neurologista"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="appointmentDate">Data</Label>
                          <Input
                            id="appointmentDate"
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="appointmentTime">Horário</Label>
                          <Input
                            id="appointmentTime"
                            type="time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="appointmentLocation">Local</Label>
                        <Input
                          id="appointmentLocation"
                          value={appointmentLocation}
                          onChange={(e) => setAppointmentLocation(e.target.value)}
                          placeholder="Ex: Clínica São Lucas"
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointmentNotes">Observações</Label>
                        <Textarea
                          id="appointmentNotes"
                          value={appointmentNotes}
                          onChange={(e) => setAppointmentNotes(e.target.value)}
                          placeholder="Informações adicionais..."
                        />
                      </div>
                      <Button onClick={handleAddAppointment} className="w-full bg-blue-600 hover:bg-blue-700">
                        Agendar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {appointments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma consulta agendada</p>
                    </CardContent>
                  </Card>
                ) : (
                  appointments.map((app) => (
                    <Card key={app.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-blue-900">{app.title}</CardTitle>
                            <CardDescription>{app.type}</CardDescription>
                          </div>
                          <Badge className="bg-blue-600">
                            <Bell className="w-3 h-3 mr-1" />
                            Lembrete ativo
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{new Date(app.date).toLocaleDateString('pt-BR')}</span>
                            <Clock className="w-4 h-4 text-blue-600 ml-2" />
                            <span>{app.time}</span>
                          </div>
                          {app.location && (
                            <p className="text-sm text-gray-600">📍 {app.location}</p>
                          )}
                          {app.notes && (
                            <p className="text-sm text-gray-600 mt-2">{app.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!selectedChild && children.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Bem-vindo ao AzulCare!
              </h3>
              <p className="text-gray-600 mb-6">
                Comece adicionando o perfil da primeira criança
              </p>
              <Button
                onClick={() => setAddChildOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Criança
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
