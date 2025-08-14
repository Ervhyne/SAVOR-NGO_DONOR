import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Search, MessageCircle, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User as UserType, Message } from '../App';

interface MessagesProps {
  user: UserType | null;
  messages: Message[];
  onNavigate: (page: AppPage) => void;
}

export function Messages({ user, onNavigate }: MessagesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  if (!user) return null;

  // Mock conversations for demo
  const conversations = [
    {
      id: '1',
      name: user.role === 'donor' ? 'Hope Foundation' : 'John Doe',
      lastMessage: 'Thank you for your donation! The vegetables were perfect for our community kitchen.',
      timestamp: '2 hours ago',
      unread: 2,
      donationId: '1'
    },
    {
      id: '2',
      name: user.role === 'donor' ? 'City Food Bank' : 'Sarah\'s Restaurant',
      lastMessage: 'We can pick up the canned goods tomorrow at 2 PM. Is that convenient?',
      timestamp: '1 day ago',
      unread: 0,
      donationId: '2'
    }
  ];

  // Mock conversation messages
  const conversationMessages = [
    {
      id: '1',
      senderId: user.role === 'donor' ? '2' : '1',
      senderName: user.role === 'donor' ? 'Hope Foundation' : 'John Doe',
      message: 'Hi! We received your donation request. The fresh vegetables look perfect for our community kitchen.',
      timestamp: '2025-08-13T10:30:00Z',
      isOwn: false
    },
    {
      id: '2',
      senderId: user.id,
      senderName: user.name,
      message: 'Great! What time works best for pickup?',
      timestamp: '2025-08-13T10:45:00Z',
      isOwn: true
    },
    {
      id: '3',
      senderId: user.role === 'donor' ? '2' : '1',
      senderName: user.role === 'donor' ? 'Hope Foundation' : 'John Doe',
      message: 'Tomorrow at 2 PM would be perfect. Our volunteer Mike will come for pickup.',
      timestamp: '2025-08-13T11:00:00Z',
      isOwn: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the server
    toast.success('Message sent');
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b bg-white">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="font-medium text-sm">{conversation?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'donor' ? 'NGO Partner' : 'Food Donor'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 min-h-[calc(100vh-200px)]">
            {conversationMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-md mx-auto flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate(user.role === 'donor' ? 'donor-dashboard' : 'ngo-dashboard')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Conversations */}
          <div className="space-y-3">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <Card 
                  key={conversation.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                            {conversation.unread > 0 && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{conversation.unread}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {conversation.lastMessage}
                        </p>
                        {conversation.donationId && (
                          <p className="text-xs text-blue-600 mt-1">
                            Related to donation #{conversation.donationId}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No matching conversations' : 'No notifications yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search criteria'
                      : user.role === 'donor' 
                        ? 'Notifications with NGOs will appear here when you make donations'
                        : 'Notifications with donors will appear here when you receive donations'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
