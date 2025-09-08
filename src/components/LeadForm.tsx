import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createLead, updateLead } from '../store/slices/leadSlice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { FileText, DollarSign } from 'lucide-react';
import { Lead } from '../types';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  lead?: Lead | null;
}

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, customerId, lead }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'New' as 'New' | 'Contacted' | 'Converted' | 'Lost',
    value: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        title: lead.title,
        description: lead.description,
        status: lead.status,
        value: lead.value.toString(),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'New',
        value: '',
      });
    }
  }, [lead, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as 'New' | 'Contacted' | 'Converted' | 'Lost',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      value: parseFloat(formData.value) || 0,
      customerId,
    };
    
    if (lead) {
      dispatch(updateLead({ id: lead._id, ...submitData }) as any);
    } else {
      dispatch(createLead(submitData) as any);
    }
    
    onClose();
  };

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Lost', label: 'Lost' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </DialogTitle>
          <DialogDescription>
            {lead 
              ? 'Update lead information below.' 
              : 'Fill in the details to add a new lead.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Lead title"
                value={formData.title}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Lead description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Value ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="value"
                  name="value"
                  type="number"
                  placeholder="0.00"
                  value={formData.value}
                  onChange={handleChange}
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary">
              {lead ? 'Update Lead' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadForm;