// family-tree.component.ts
import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { FamilyTreeService } from './family-tree.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  familyTree: any;
  input:any;
 // el: any;

  constructor(private familyTreeService: FamilyTreeService, private el: ElementRef) { }

  ngOnInit(): void {
  }

  generateFamilyTree(): void {
    this.familyTreeService.generateFamilyTree(this.input)
      .subscribe(data => {
        this.familyTree = data;
        this.familyTree=this.familyTree.description;
        this.familyTree=JSON.parse(this.familyTree)
        ///this.familyTree=this.mergeIdenticalParents(this.familyTree);

        const formattedData = this.convertToD3Format(this.familyTree);
        this.createFamilyTree(formattedData);
       // this.createFamilyTree();  // Call the method to create the visualization
      });
  }
 



  convertToD3Format(data: any) {
    // D3 expects a hierarchical structure
    return {
      name: data.name,
      children: data.children.map((child: any) => this.convertToD3Format(child))
    };
  }
  
  createFamilyTree(data: any): void {
    const width = 1500; // Adjust width
    const height = 600; // Adjust height

    const svg = d3.select(this.el.nativeElement).select('svg');
    svg.selectAll('*').remove(); // Clear previous drawings

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height, width]);
    treeLayout(root);

    // Draw links
    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d: any)=> d.source.y)
      .attr('y1', (d: any) =>d.source.x)
      .attr('x2', (d: any) =>d.target.y)
      .attr('y2', (d: any) =>d.target.x)
      .attr('stroke', '#ccc');

    // Draw nodes
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    nodes.append('rect')
      .attr('width', 100)
      .attr('height', 40)
      .attr('x', -50)
      .attr('y', -20)
      .attr('fill', '#fff')
      .attr('stroke', '#000');

    nodes.append('text')
      .attr('dy', 5)
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .style('font-size', '12px');
  }


}






