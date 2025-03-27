import 'dart:math';

import 'package:flutter/material.dart';

import '../../../app_color.dart';

class ExperienceItem {
  final int id;
  String title;
  String company;
  String location;
  String startDate;
  String endDate;
  bool isCurrentPosition;
  List<String> bulletPoints;

  ExperienceItem({
    required this.id,
    this.title = '',
    this.company = '',
    this.location = '',
    this.startDate = '',
    this.endDate = '',
    this.isCurrentPosition = false,
    List<String>? bulletPoints,
  }) : bulletPoints = bulletPoints ?? ['', '', ''];

  // Clone with specific field updates
  ExperienceItem copyWith({
    String? title,
    String? company,
    String? location,
    String? startDate,
    String? endDate,
    bool? isCurrentPosition,
    List<String>? bulletPoints,
  }) {
    return ExperienceItem(
      id: id,
      title: title ?? this.title,
      company: company ?? this.company,
      location: location ?? this.location,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isCurrentPosition: isCurrentPosition ?? this.isCurrentPosition,
      bulletPoints: bulletPoints ?? this.bulletPoints,
    );
  }
}

class Experience extends StatefulWidget {
  final List<ExperienceItem> experienceList;
  final Function(List<ExperienceItem>) setExperienceList;

  const Experience({
    Key? key,
    required this.experienceList,
    required this.setExperienceList,
  }) : super(key: key);

  @override
  State<Experience> createState() => _ExperienceState();
}

class _ExperienceState extends State<Experience> {
  int? reviewingId;

  @override
  void initState() {
    super.initState();
    _ensureBulletPoints();
  }

  // AI review function for experience
  void _reviewAI(int experienceId) {
    // Set the reviewing state to show loading indicator
    setState(() {
      reviewingId = experienceId;
    });
    
    final experience = widget.experienceList.firstWhere((item) => item.id == experienceId);
    
    // Simulate AI generation (replace with actual API call)
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      
      // Example AI-generated content based on the existing entry
      final title = experience.title.isNotEmpty ? experience.title : "position";
      final company = experience.company.isNotEmpty ? experience.company : "company";
      
      // Update the entry with AI suggestions
      final updatedList = widget.experienceList.map((item) {
        if (item.id == experienceId) {
          return item.copyWith(
            bulletPoints: [
              "Led key initiatives that increased efficiency by 25% for $company's core processes",
              "Collaborated with cross-functional teams to deliver projects on time and within budget",
              "Implemented innovative solutions that gained recognition from senior leadership"
            ]
          );
        }
        return item;
      }).toList();
      
      widget.setExperienceList(updatedList);
      
      // Clear the reviewing state
      setState(() {
        reviewingId = null;
      });
    });
  }
  
  // Add a new experience entry
  void _addExperience() {
    int newId = 1;
    if (widget.experienceList.isNotEmpty) {
      newId = widget.experienceList.map((e) => e.id).reduce(max) + 1;
    }
    
    final newExperience = ExperienceItem(
      id: newId,
      bulletPoints: ['', '', '']
    );
    
    widget.setExperienceList([...widget.experienceList, newExperience]);
  }

  // Remove an experience entry
  void _removeExperience(int id) {
    if (widget.experienceList.length <= 1) return;
    
    final updatedList = widget.experienceList.where((item) => item.id != id).toList();
    widget.setExperienceList(updatedList);
  }

  // Update an experience entry
  void _updateExperience(int id, String field, dynamic value) {
    final updatedList = widget.experienceList.map((item) {
      if (item.id == id) {
        // Special handling for current position checkbox
        if (field == 'isCurrentPosition') {
          return item.copyWith(
            isCurrentPosition: value as bool,
            endDate: (value as bool) ? 'Present' : item.endDate,
          );
        }
        
        // Handle string fields
        switch (field) {
          case 'title':
            return item.copyWith(title: value as String);
          case 'company':
            return item.copyWith(company: value as String);
          case 'location':
            return item.copyWith(location: value as String);
          case 'startDate':
            return item.copyWith(startDate: value as String);
          case 'endDate':
            return item.copyWith(endDate: value as String);
        }
      }
      return item;
    }).toList();
    
    widget.setExperienceList(updatedList);
  }

  // Update a specific bullet point
  void _updateBulletPoint(int experienceId, int index, String value) {
    final updatedList = widget.experienceList.map((item) {
      if (item.id == experienceId) {
        final updatedBulletPoints = List<String>.from(item.bulletPoints);
        updatedBulletPoints[index] = value;
        return item.copyWith(bulletPoints: updatedBulletPoints);
      }
      return item;
    }).toList();
    
    widget.setExperienceList(updatedList);
  }

  // Convert existing descriptions to bullet points if needed
  void _ensureBulletPoints() {
    final updatedList = widget.experienceList.map((item) {
      if (item.bulletPoints.isEmpty) {
        return item.copyWith(bulletPoints: ['', '', '']);
      }
      
      // Make sure we have at least 3 bullet points
      final bulletPoints = List<String>.from(item.bulletPoints);
      while (bulletPoints.length < 3) {
        bulletPoints.add('');
      }
      
      return item.copyWith(bulletPoints: bulletPoints);
    }).toList();
    
    // Only update if there's a change to avoid infinite loops
    if (updatedList.any((item) => item.bulletPoints.length != 3)) {
      widget.setExperienceList(updatedList);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Card(
        color: AppColor.card,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppColor.border, width: 0.5),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Work Experience",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColor.text,
                ),
              ),
              
              const SizedBox(height: 16),
              
              ...widget.experienceList.asMap().entries.map((entry) {
                final index = entry.key;
                final exp = entry.value;
                
                return Column(
                  key: ValueKey('exp-${exp.id}'),
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (index > 0)
                      const Divider(
                        height: 32,
                        color: AppColor.border,
                      ),
                    
                    // Experience title row with remove button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              "Experience #${index + 1}",
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColor.text,
                              ),
                            ),
                            const SizedBox(width: 8),
                            
                            // AI generate button
                            GestureDetector(
                              onTap: reviewingId == null ? () => _reviewAI(exp.id) : null,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColor.userBubble,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: reviewingId == exp.id
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        color: AppColor.accent,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.auto_awesome,
                                          color: AppColor.accent,
                                          size: 16,
                                        ),
                                        const SizedBox(width: 4),
                                        const Text(
                                          "Generate Details with AI",
                                          style: TextStyle(
                                            fontSize: 12, 
                                            color: AppColor.text
                                          ),
                                        ),
                                      ],
                                    ),
                              ),
                            ),
                          ],
                        ),
                        
                        // Remove button
                        if (widget.experienceList.length > 1)
                          IconButton(
                            onPressed: () => _removeExperience(exp.id),
                            icon: const Icon(Icons.close, color: AppColor.secondaryText),
                            tooltip: 'Remove experience',
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Job title
                    _buildTextField(
                      label: "Job Title",
                      value: exp.title,
                      onChanged: (value) => _updateExperience(exp.id, 'title', value),
                      placeholder: "Ex: Software Developer",
                      icon: Icons.work,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Company
                    _buildTextField(
                      label: "Company",
                      value: exp.company,
                      onChanged: (value) => _updateExperience(exp.id, 'company', value),
                      placeholder: "Ex: Tech Solutions Inc.",
                      icon: Icons.business,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Location
                    _buildTextField(
                      label: "Location",
                      value: exp.location,
                      onChanged: (value) => _updateExperience(exp.id, 'location', value),
                      placeholder: "Ex: Orlando, FL",
                      icon: Icons.location_on,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Date range
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            label: "Start Date",
                            value: exp.startDate,
                            onChanged: (value) => _updateExperience(exp.id, 'startDate', value),
                            placeholder: "Ex: January 2020",
                            icon: Icons.calendar_today,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            label: "End Date",
                            value: exp.endDate,
                            onChanged: (value) => _updateExperience(exp.id, 'endDate', value),
                            placeholder: "Ex: December 2022",
                            icon: Icons.calendar_today,
                            enabled: !exp.isCurrentPosition,
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Current position checkbox
                    Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: exp.isCurrentPosition,
                            onChanged: (value) => _updateExperience(
                              exp.id, 
                              'isCurrentPosition', 
                              value ?? false
                            ),
                            activeColor: AppColor.accent,
                            checkColor: AppColor.userBubble,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          "This is my current position",
                          style: TextStyle(
                            color: AppColor.text,
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Bullet points container
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Responsibilities & Achievements",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: AppColor.secondaryText,
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Bullet point 1
                        _buildBulletPoint(
                          index: 0,
                          experienceId: exp.id,
                          value: exp.bulletPoints[0],
                          placeholder: "Ex: Led development of new features that increased user engagement by 30%",
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Bullet point 2
                        _buildBulletPoint(
                          index: 1,
                          experienceId: exp.id,
                          value: exp.bulletPoints[1],
                          placeholder: "Ex: Collaborated with cross-functional teams to deliver projects on time",
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Bullet point 3
                        _buildBulletPoint(
                          index: 2,
                          experienceId: exp.id,
                          value: exp.bulletPoints[2],
                          placeholder: "Ex: Implemented automated testing that reduced QA time by 25%",
                        ),
                      ],
                    ),
                  ],
                );
              }).toList(),
              
              const SizedBox(height: 24),
              
              // Add experience button
              Center(
                child: ElevatedButton.icon(
                  onPressed: reviewingId == null ? _addExperience : null,
                  icon: const Icon(Icons.add),
                  label: const Text("Add Another Experience"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColor.userBubble,
                    foregroundColor: AppColor.text,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildTextField({
    required String label,
    required String value,
    required Function(String) onChanged,
    required String placeholder,
    required IconData icon,
    bool enabled = true,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColor.secondaryText,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: TextEditingController(text: value)..selection = TextSelection.fromPosition(
              TextPosition(offset: value.length),
          ),
          onChanged: onChanged,
          enabled: enabled,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: TextStyle(
              color: AppColor.secondaryText.withOpacity(0.5),
              fontSize: 14,
            ),
            prefixIcon: Icon(icon, color: AppColor.secondaryText),
            filled: true,
            fillColor: AppColor.userBubble,
            enabledBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColor.border),
              borderRadius: BorderRadius.circular(8),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: const BorderSide(color: AppColor.accent, width: 2),
              borderRadius: BorderRadius.circular(8),
            ),
            disabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: AppColor.border.withOpacity(0.5)),
              borderRadius: BorderRadius.circular(8),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
          style: TextStyle(
            color: enabled ? AppColor.text : AppColor.secondaryText,
          ),
        ),
      ],
    );
  }
  
  Widget _buildBulletPoint({
    required int index,
    required int experienceId,
    required String value,
    required String placeholder,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(top: 16, right: 8),
          child: Text(
            "•",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColor.text,
            ),
          ),
        ),
        Expanded(
          child: TextField(
            controller: TextEditingController(text: value)..selection = TextSelection.fromPosition(
                TextPosition(offset: value.length),
            ),
            onChanged: (newValue) => _updateBulletPoint(experienceId, index, newValue),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: TextStyle(
                color: AppColor.secondaryText.withOpacity(0.5),
                fontSize: 14,
              ),
              filled: true,
              fillColor: AppColor.userBubble,
              enabledBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: AppColor.border),
                borderRadius: BorderRadius.circular(8),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: AppColor.accent, width: 2),
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
            style: const TextStyle(color: AppColor.text),
            maxLines: 2,
          ),
        ),
      ],
    );
  }
}