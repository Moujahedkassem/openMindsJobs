import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/profileApi';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  MapPin, 
  DollarSign, 
  Clock, 
  Edit3, 
  Save, 
  X,
  Plus,
  Trash2,
  Star,
  Briefcase,
  GraduationCap,
  FolderOpen
} from 'lucide-react';
import { useToast } from '../components/ui/toast';

export function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await profileApi.getProfile(user!.id);
      if (result.success) {
        setProfile(result.data);
      } else {
        addToast({
          type: 'error',
          title: 'Failed to load profile'
        });
      }
    } catch (error) {
              addToast({
          type: 'error',
          title: 'Error loading profile'
        });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string, data: any) => {
    setEditing(section);
    setEditData(data);
  };

  const handleSave = async (section: string) => {
    try {
      let result;
      
      switch (section) {
        case 'basic':
          result = await profileApi.updateBasicInfo(user!.id, editData);
          break;
        default:
          return;
      }

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Profile updated successfully'
        });
        setEditing(null);
        setEditData({});
        loadProfile(); // Reload profile data
      } else {
        addToast({
          type: 'error',
          title: 'Failed to update profile',
          message: result.error
        });
      }
    } catch (error) {
              addToast({
          type: 'error',
          title: 'Error updating profile'
        });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setEditData({});
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 bg-white/80 backdrop-blur-md border-white/20 shadow-lg">
            <div className="flex items-start space-x-6">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profile.user.name || 'User')}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.user.name || 'Your Name'}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      {profile.user.headline || 'Add a professional headline'}
                    </p>
                  </div>
                  
                  {/* Profile Completion */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${profile.user.profile_completion || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {profile.user.profile_completion || 0}%
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.user.location || 'Add location'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {profile.user.hourly_rate 
                        ? `$${profile.user.hourly_rate}/hr` 
                        : 'Set hourly rate'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">
                      {profile.user.availability_status || 'Available'}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    {editing !== 'basic' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('basic', {
                          headline: profile.user.headline,
                          bio: profile.user.bio,
                          location: profile.user.location,
                          hourly_rate: profile.user.hourly_rate,
                          availability_status: profile.user.availability_status
                        })}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {editing === 'basic' ? (
                    <div className="space-y-4">
                      <Input
                        placeholder="Professional headline"
                        value={editData.headline || ''}
                        onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                      />
                      <Textarea
                        placeholder="Tell us about yourself..."
                        value={editData.bio || ''}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={4}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Location"
                          value={editData.location || ''}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Hourly rate"
                          value={editData.hourly_rate || ''}
                          onChange={(e) => setEditData({ ...editData, hourly_rate: parseFloat(e.target.value) || 0 })}
                        />
                        <select
                          value={editData.availability_status || 'AVAILABLE'}
                          onChange={(e) => setEditData({ ...editData, availability_status: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="BUSY">Busy</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave('basic')} className="bg-blue-600 hover:bg-blue-700">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {profile.user.bio || 'Add a professional bio to tell potential clients about your expertise and experience.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-md border-white/20">
              <TabsTrigger value="skills" className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Skills</span>
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Experience</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4" />
                <span>Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </TabsTrigger>
            </TabsList>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                </div>
                
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.skills.map((userSkill: any) => (
                      <div key={userSkill.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{userSkill.skill?.name}</h4>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Badge variant="secondary" className="capitalize">
                            {userSkill.proficiency_level}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {userSkill.years_experience} year{userSkill.years_experience !== 1 ? 's' : ''} experience
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No skills added yet</p>
                    <p className="text-sm">Add your technical skills and expertise</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Experience
                  </Button>
                </div>
                
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-4">
                    {profile.experience.map((exp: any) => (
                      <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">
                              {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                            </p>
                            {exp.description && (
                              <p className="text-gray-700 mt-2">{exp.description}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No experience added yet</p>
                    <p className="text-sm">Add your work history and achievements</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Portfolio Projects</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                  </Button>
                </div>
                
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.portfolio.map((project: any) => (
                      <div key={project.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {project.description && (
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.map((tech: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          {project.project_url && (
                            <Button variant="outline" size="sm" className="text-xs">
                              View Project
                            </Button>
                          )}
                          {project.github_url && (
                            <Button variant="outline" size="sm" className="text-xs">
                              GitHub
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No portfolio projects yet</p>
                    <p className="text-sm">Showcase your best work and projects</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Education
                  </Button>
                </div>
                
                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-4">
                    {profile.education.map((edu: any) => (
                      <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            {edu.field_of_study && (
                              <p className="text-gray-600">{edu.field_of_study}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                            </p>
                            {edu.description && (
                              <p className="text-gray-700 mt-2">{edu.description}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No education added yet</p>
                    <p className="text-sm">Add your academic background and certifications</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
