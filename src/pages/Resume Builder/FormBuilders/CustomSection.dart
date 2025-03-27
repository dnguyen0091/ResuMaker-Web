import 'dart:math';

import 'package:flutter/material.dart';

import '../../../app_color.dart';

class CustomSectionEntry {
  final int id;
  String title;
  String subtitle;
  String location;
  String startDate;
  String endDate;
  bool isCurrentPosition;
  List<String> bulletPoints;

  CustomSectionEntry({
    required this.id,
    this.title = '',
    this.subtitle = '',
    this.location = '',
    this.startDate = '',
    this.endDate = '',
    this.isCurrentPosition = false,
    List<String>? bulletPoints,
  }) : bulletPoints = bulletPoints ?? ['', '', ''];

  // Clone with specific field updates
  CustomSectionEntry copyWith({
    String? title,
    String? subtitle,
    String? location,
    String? startDate,
    String? endDate,
    bool? isCurrentPosition,
    List<String>? bulletPoints,
  }) {
    return CustomSectionEntry(
      id: id,
      title: title ?? this.title,
      subtitle: subtitle ?? this.subtitle,
      location: location ?? this.location,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isCurrentPosition: isCurrentPosition ?? this.isCurrentPosition,
      bulletPoints: bulletPoints ?? this.bulletPoints,
    );
  }
}

class CustomSection {
  String title;
  List<CustomSectionEntry> entries;

  CustomSection({
    this.title = '',
    List<CustomSectionEntry>? entries,
  }) : entries = entries ?? [
        CustomSectionEntry(id: 1),
      ];

  // Clone with specific field updates
  CustomSection copyWith({
    String? title,
    List<CustomSectionEntry>? entries,
  }) {
    return CustomSection(
      title: title ?? this.title,
      entries: entries ?? this.entries,
    );
  }
}

class CustomSectionForm extends StatefulWidget {
  final CustomSection section;
  final Function(CustomSection) onChange;

  const CustomSectionForm({
    Key? key,
    required this.section,
    required this.onChange,
  }) : super(key: key);

  @override
  State<CustomSectionForm> createState() => _CustomSectionFormState();
}

class _CustomSectionFormState extends State<CustomSectionForm> {
  int? reviewingId;

  @override
  void initState() {
    super.initState();
    _ensureBulletPoints();
  }

  // Update section title
  void _updateSectionTitle(String newTitle) {
    widget.onChange(
      widget.section.copyWith(title: newTitle),
    );
  }

  // AI review function for items
  void _reviewAI(int entryId) {
    // Set the reviewing state to show loading indicator
    setState(() {
      reviewingId = entryId;
    });
    
    final entry = widget.section.entries.firstWhere((item) => item.id == entryId);
    final sectionType = widget.section.title.toLowerCase();
    
    // Simulate AI generation (replace with actual API call)
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      
      // Example AI-generated content based on the section title
      List<String> generatedBulletPoints = [];
      
      if (sectionType.contains('skill') || sectionType.contains('technical')) {
        generatedBulletPoints = [
          "Advanced proficiency in ${entry.title.isNotEmpty ? entry.title : 'relevant technologies'}",
          "Applied ${entry.title.isNotEmpty ? entry.title : 'these skills'} to solve complex problems",
          "Continuously learning and improving ${entry.title.isNotEmpty ? entry.title : 'skill set'}"
        ];
      } else if (sectionType.contains('project')) {
        generatedBulletPoints = [
          "Led development of ${entry.title.isNotEmpty ? entry.title : 'project'} that achieved significant metrics",
          "Implemented innovative solutions to overcome technical challenges",
          "Collaborated with team members to ensure timely delivery"
        ];
      } else if (sectionType.contains('volunteer') || sectionType.contains('community')) {
        generatedBulletPoints = [
          "Contributed over 100 hours to ${entry.title.isNotEmpty ? entry.title : 'this initiative'}",
          "Helped organize events that benefited the local community",
          "Received recognition for outstanding contributions"
        ];
      } else {
        generatedBulletPoints = [
          "Demonstrated excellence in ${entry.title.isNotEmpty ? entry.title : 'this area'}",
          "Applied specialized knowledge to achieve measurable results",
          "Received recognition for outstanding performance"
        ];
      }
      
      // Update the entry with AI suggestions
      final updatedEntries = widget.section.entries.map((item) {
        if (item.id == entryId) {
          return item.copyWith(bulletPoints: generatedBulletPoints);
        }
        return item;
      }).toList();
      
      widget.onChange(
        widget.section.copyWith(entries: updatedEntries),
      );
      
      // Clear the reviewing state
      setState(() {
        reviewingId = null;
      });
    });
  }

  // Add a new entry
  void _addEntry() {
    int newId = 1;
    if (widget.section.entries.isNotEmpty) {
      newId = widget.section.entries.map((e) => e.id).reduce(max) + 1;
    }
    
    final newEntry = CustomSectionEntry(
      id: newId,
      bulletPoints: ['', '', '']
    );
    
    widget.onChange(
      widget.section.copyWith(
        entries: [...widget.section.entries, newEntry],
      )
    );
  }

  // Remove an entry
  void _removeEntry(int id) {
    if (widget.section.entries.length <= 1) return;
    
    final updatedEntries = widget.section.entries.where((item) => item.id != id).toList();
    
    widget.onChange(
      widget.section.copyWith(entries: updatedEntries),
    );
  }

  // Update an entry
  void _updateEntry(int id, String field, dynamic value) {
    final updatedEntries = widget.section.entries.map((item) {
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
          case 'subtitle':
            return item.copyWith(subtitle: value as String);
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
    
    widget.onChange(
      widget.section.copyWith(entries: updatedEntries),
    );
  }

  // Update a specific bullet point
  void _updateBulletPoint(int entryId, int index, String value) {
    final updatedEntries = widget.section.entries.map((item) {
      if (item.id == entryId) {
        final updatedBulletPoints = List<String>.from(item.bulletPoints);
        
        // Ensure the list has enough elements
        while (updatedBulletPoints.length <= index) {
          updatedBulletPoints.add('');
        }
        
        updatedBulletPoints[index] = value;
        return item.copyWith(bulletPoints: updatedBulletPoints);
      }
      return item;
    }).toList();
    
    widget.onChange(
      widget.section.copyWith(entries: updatedEntries),
    );
  }

  // Ensure bullet points are properly initialized
  void _ensureBulletPoints() {
    final updatedEntries = widget.section.entries.map((item) {
      if (item.bulletPoints.isEmpty) {
        return item.copyWith(bulletPoints: ['', '', '']);
      }
      
      // Make sure we have exactly 3 bullet points
      final bulletPoints = List<String>.from(item.bulletPoints);
      while (bulletPoints.length < 3) {
        bulletPoints.add('');
      }
      
      // Trim to 3 bullet points if there are more
      if (bulletPoints.length > 3) {
        bulletPoints.removeRange(3, bulletPoints.length);
      }
      
      return item.copyWith(bulletPoints: bulletPoints);
    }).toList();
    
    // Only update if there's a change
    if (updatedEntries.any((item) => item.bulletPoints.length != 3)) {
      widget.onChange(
        widget.section.copyWith(entries: updatedEntries),
      );
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
              // Section title input
              TextField(
                controller: TextEditingController(text: widget.section.title)
                  ..selection = TextSelection.fromPosition(
                    TextPosition(offset: widget.section.title.length),
                  ),
                onChanged: _updateSectionTitle,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColor.text,
                ),
                decoration: InputDecoration(
                  hintText: 'Section Title (e.g. Skills, Projects, Certifications)',
                  hintStyle: TextStyle(
                    color: AppColor.secondaryText.withOpacity(0.7),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.only(bottom: 8),
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Entries list
              ...widget.section.entries.asMap().entries.map((mapEntry) {
                final index = mapEntry.key;
                final entry = mapEntry.value;
                
                return Column(
                  key: ValueKey('entry-${entry.id}'),
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (index > 0)
                      const Divider(
                        height: 32,
                        color: AppColor.border,
                      ),
                    
                    // Entry header with remove button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              "${widget.section.title.isEmpty ? 'Entry' : widget.section.title} #${index + 1}",
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColor.text,
                              ),
                            ),
                            const SizedBox(width: 8),
                            
                            // AI generate button
                            GestureDetector(
                              onTap: reviewingId == null ? () => _reviewAI(entry.id) : null,
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColor.userBubble,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: reviewingId == entry.id
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
                        if (widget.section.entries.length > 1)
                          IconButton(
                            onPressed: () => _removeEntry(entry.id),
                            icon: const Icon(Icons.close, color: AppColor.secondaryText),
                            tooltip: 'Remove entry',
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Title
                    _buildTextField(
                      label: "Title",
                      value: entry.title,
                      onChanged: (value) => _updateEntry(entry.id, 'title', value),
                      placeholder: "Ex: Project Name, Skill, Certification",
                      icon: Icons.title,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Subtitle/Organization
                    _buildTextField(
                      label: "Subtitle/Organization",
                      value: entry.subtitle,
                      onChanged: (value) => _updateEntry(entry.id, 'subtitle', value),
                      placeholder: "Ex: Organization, Issuer, Technology",
                      icon: Icons.business,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Location
                    _buildTextField(
                      label: "Location",
                      value: entry.location,
                      onChanged: (value) => _updateEntry(entry.id, 'location', value),
                      placeholder: "Ex: Remote, Orlando, FL",
                      icon: Icons.location_on,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Date range
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            label: "Start Date",
                            value: entry.startDate,
                            onChanged: (value) => _updateEntry(entry.id, 'startDate', value),
                            placeholder: "Ex: January 2020",
                            icon: Icons.calendar_today,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            label: "End Date",
                            value: entry.endDate,
                            onChanged: (value) => _updateEntry(entry.id, 'endDate', value),
                            placeholder: "Ex: December 2022",
                            icon: Icons.calendar_today,
                            enabled: !entry.isCurrentPosition,
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Current/Ongoing checkbox
                    Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: entry.isCurrentPosition,
                            onChanged: (value) => _updateEntry(
                              entry.id, 
                              'isCurrentPosition', 
                              value ?? false
                            ),
                            activeColor: AppColor.accent,
                            checkColor: AppColor.userBubble,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          "This is current/ongoing",
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
                          "Details & Highlights",
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
                          entryId: entry.id,
                          value: entry.bulletPoints.isNotEmpty ? entry.bulletPoints[0] : '',
                          placeholder: "Ex: Developed a feature that improved user experience",
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Bullet point 2
                        _buildBulletPoint(
                          index: 1,
                          entryId: entry.id,
                          value: entry.bulletPoints.length > 1 ? entry.bulletPoints[1] : '',
                          placeholder: "Ex: Collaborated with team members to achieve goals",
                        ),
                        
                        const SizedBox(height: 12),
                        
                        // Bullet point 3
                        _buildBulletPoint(
                          index: 2,
                          entryId: entry.id,
                          value: entry.bulletPoints.length > 2 ? entry.bulletPoints[2] : '',
                          placeholder: "Ex: Received recognition for outstanding contributions",
                        ),
                      ],
                    ),
                  ],
                );
              }).toList(),
              
              const SizedBox(height: 24),
              
              // Add entry button
              Center(
                child: ElevatedButton.icon(
                  onPressed: reviewingId == null ? _addEntry : null,
                  icon: const Icon(Icons.add),
                  label: Text(
                    "Add Another ${widget.section.title.isEmpty ? 'Entry' : widget.section.title}"
                  ),
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
    required int entryId,
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
            onChanged: (newValue) => _updateBulletPoint(entryId, index, newValue),
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