import 'dart:math';

import 'package:flutter/material.dart';

import '../../../app_color.dart';

class EducationItem {
  final int id;
  String school;
  String location;
  String degree;
  String fieldOfStudy;
  String startDate;
  String endDate;
  List<String> bulletPoints;

  EducationItem({
    required this.id,
    this.school = '',
    this.location = '',
    this.degree = '',
    this.fieldOfStudy = '',
    this.startDate = '',
    this.endDate = '',
    List<String>? bulletPoints,
  }) : bulletPoints = bulletPoints ?? ['', ''];

  // Clone with specific field updates
  EducationItem copyWith({
    String? school,
    String? location,
    String? degree,
    String? fieldOfStudy,
    String? startDate,
    String? endDate,
    List<String>? bulletPoints,
  }) {
    return EducationItem(
      id: id,
      school: school ?? this.school,
      location: location ?? this.location,
      degree: degree ?? this.degree,
      fieldOfStudy: fieldOfStudy ?? this.fieldOfStudy,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      bulletPoints: bulletPoints ?? this.bulletPoints,
    );
  }
}

class Education extends StatefulWidget {
  final List<EducationItem> educationList;
  final Function(List<EducationItem>) setEducationList;

  const Education({
    Key? key,
    required this.educationList,
    required this.setEducationList,
  }) : super(key: key);

  @override
  State<Education> createState() => _EducationState();
}

class _EducationState extends State<Education> {
  int? reviewingId;

  @override
  void initState() {
    super.initState();
    _ensureBulletPoints();
  }

  // AI review function for education
  void _reviewAI(int educationId) {
    // Set the reviewing state to show loading indicator
    setState(() {
      reviewingId = educationId;
    });
    
    final education = widget.educationList.firstWhere((item) => item.id == educationId);
    
    // Simulate AI generation (replace with actual API call)
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      
      // Example AI-generated content based on the existing entry
      final school = education.school.isNotEmpty ? education.school : "university";
      final degree = education.degree.isNotEmpty ? education.degree : "degree";
      
      // Update the entry with AI suggestions
      final updatedList = widget.educationList.map((item) {
        if (item.id == educationId) {
          return item.copyWith(
            bulletPoints: [
              "Dean's List for academic excellence, maintaining a GPA above 3.8",
              "Active member of the ${item.fieldOfStudy} Student Association, participating in research and community outreach",
            ]
          );
        }
        return item;
      }).toList();
      
      widget.setEducationList(updatedList);
      
      // Clear the reviewing state
      setState(() {
        reviewingId = null;
      });
    });
  }
  
  // Add a new education entry
  void _addEducation() {
    int newId = 1;
    if (widget.educationList.isNotEmpty) {
      newId = widget.educationList.map((e) => e.id).reduce(max) + 1;
    }
    
    final newEducation = EducationItem(
      id: newId,
      bulletPoints: ['', '']
    );
    
    widget.setEducationList([...widget.educationList, newEducation]);
  }

  // Remove an education entry
  void _removeEducation(int id) {
    if (widget.educationList.length <= 1) return;
    
    final updatedList = widget.educationList.where((item) => item.id != id).toList();
    widget.setEducationList(updatedList);
  }

  // Update an education entry
  void _updateEducation(int id, String field, String value) {
    final updatedList = widget.educationList.map((item) {
      if (item.id == id) {
        // Handle each field
        switch (field) {
          case 'school':
            return item.copyWith(school: value);
          case 'location':
            return item.copyWith(location: value);
          case 'degree':
            return item.copyWith(degree: value);
          case 'fieldOfStudy':
            return item.copyWith(fieldOfStudy: value);
          case 'startDate':
            return item.copyWith(startDate: value);
          case 'endDate':
            return item.copyWith(endDate: value);
        }
      }
      return item;
    }).toList();
    
    widget.setEducationList(updatedList);
  }

  // Update a specific bullet point
  void _updateBulletPoint(int educationId, int index, String value) {
    final updatedList = widget.educationList.map((item) {
      if (item.id == educationId) {
        final updatedBulletPoints = List<String>.from(item.bulletPoints);
        updatedBulletPoints[index] = value;
        return item.copyWith(bulletPoints: updatedBulletPoints);
      }
      return item;
    }).toList();
    
    widget.setEducationList(updatedList);
  }

  // Convert existing descriptions to bullet points if needed
  void _ensureBulletPoints() {
    final updatedList = widget.educationList.map((item) {
      if (item.bulletPoints.isEmpty) {
        return item.copyWith(bulletPoints: ['', '']);
      }
      
      // Make sure we have exactly 2 bullet points (as in the React version)
      final bulletPoints = List<String>.from(item.bulletPoints);
      while (bulletPoints.length < 2) {
        bulletPoints.add('');
      }
      
      // Trim to 2 bullet points if there are more
      if (bulletPoints.length > 2) {
        bulletPoints.removeRange(2, bulletPoints.length);
      }
      
      return item.copyWith(bulletPoints: bulletPoints);
    }).toList();
    
    // Only update if there's a change
    if (updatedList.any((item) => item.bulletPoints.length != 2)) {
      widget.setEducationList(updatedList);
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
                "Education",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColor.text,
                ),
              ),
              
              const SizedBox(height: 16),
              
              ...widget.educationList.asMap().entries.map((entry) {
                final index = entry.key;
                final edu = entry.value;
                
                return Column(
                  key: ValueKey('edu-${edu.id}'),
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (index > 0)
                      const Divider(
                        height: 32,
                        color: AppColor.border,
                      ),
                    
                    // Education title row with remove button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              "Education #${index + 1}",
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColor.text,
                              ),
                            ),
                            const SizedBox(width: 8),
                            
                            // AI generate button
                            GestureDetector(
                              onTap: reviewingId == null ? () => _reviewAI(edu.id) : null,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColor.userBubble,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: reviewingId == edu.id
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
                        if (widget.educationList.length > 1)
                          IconButton(
                            onPressed: () => _removeEducation(edu.id),
                            icon: const Icon(Icons.close, color: AppColor.secondaryText),
                            tooltip: 'Remove education',
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // School/University
                    _buildTextField(
                      label: "School/University",
                      value: edu.school,
                      onChanged: (value) => _updateEducation(edu.id, 'school', value),
                      placeholder: "Ex: University of Central Florida",
                      icon: Icons.school,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Location
                    _buildTextField(
                      label: "Location",
                      value: edu.location,
                      onChanged: (value) => _updateEducation(edu.id, 'location', value),
                      placeholder: "Ex: Orlando, FL",
                      icon: Icons.location_on,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Degree
                    _buildTextField(
                      label: "Degree",
                      value: edu.degree,
                      onChanged: (value) => _updateEducation(edu.id, 'degree', value),
                      placeholder: "Ex: Bachelor of Science",
                      icon: Icons.workspace_premium,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Field of Study
                    _buildTextField(
                      label: "Field of Study",
                      value: edu.fieldOfStudy,
                      onChanged: (value) => _updateEducation(edu.id, 'fieldOfStudy', value),
                      placeholder: "Ex: Computer Science",
                      icon: Icons.book,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Date range
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            label: "Start Date",
                            value: edu.startDate,
                            onChanged: (value) => _updateEducation(edu.id, 'startDate', value),
                            placeholder: "Ex: September 2019",
                            icon: Icons.calendar_today,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            label: "End Date (or Expected)",
                            value: edu.endDate,
                            onChanged: (value) => _updateEducation(edu.id, 'endDate', value),
                            placeholder: "Ex: May 2023 or Present",
                            icon: Icons.calendar_today,
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
                          "Additional Information (achievements, activities, etc.)",
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
                          educationId: edu.id,
                          value: edu.bulletPoints[0],
                          placeholder: "Ex: Dean's List 2019-2022",
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Bullet point 2
                        _buildBulletPoint(
                          index: 1,
                          educationId: edu.id,
                          value: edu.bulletPoints[1],
                          placeholder: "Ex: President of Computer Science Club",
                        ),
                      ],
                    ),
                  ],
                );
              }).toList(),
              
              const SizedBox(height: 24),
              
              // Add education button
              Center(
                child: ElevatedButton.icon(
                  onPressed: reviewingId == null ? _addEducation : null,
                  icon: const Icon(Icons.add),
                  label: const Text("Add Another Education"),
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
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
          style: const TextStyle(color: AppColor.text),
        ),
      ],
    );
  }
  
  Widget _buildBulletPoint({
    required int index,
    required int educationId,
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
            onChanged: (newValue) => _updateBulletPoint(educationId, index, newValue),
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